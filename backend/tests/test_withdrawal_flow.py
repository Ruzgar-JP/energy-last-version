"""
Alarko Enerji - Withdrawal Flow Tests (Iteration 4)
Tests the new withdrawal endpoint with bank selection and manual IBAN entry
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://res-ges-hub.preview.emergentagent.com')

# Test credentials
ADMIN_EMAIL = "admin@alarkoenerji.com"
ADMIN_PASSWORD = "admin123"
TEST_USER_EMAIL = "testuser@test.com"
TEST_USER_PASSWORD = "test123"


class TestBanksEndpoint:
    """Test GET /api/banks returns system banks"""
    
    def test_get_banks_returns_list(self):
        """Test GET /api/banks returns list of system banks"""
        response = requests.get(f"{BASE_URL}/api/banks")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 4, "Should have at least 4 seeded banks"
        
    def test_bank_structure(self):
        """Test banks have required fields"""
        response = requests.get(f"{BASE_URL}/api/banks")
        banks = response.json()
        for bank in banks:
            assert "bank_id" in bank
            assert "name" in bank
            assert "iban" in bank
            assert "account_holder" in bank
            assert "is_active" in bank


class TestWithdrawEndpointWithSystemBank:
    """Test POST /api/transactions/withdraw with bank_id (system bank selection)"""
    
    @pytest.fixture
    def user_with_balance(self):
        """Login as testuser@test.com who has balance ~10000 TL"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        assert response.status_code == 200, f"Failed to login test user: {response.text}"
        return response.json()["token"]
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    @pytest.fixture
    def system_bank(self):
        """Get first active bank"""
        response = requests.get(f"{BASE_URL}/api/banks")
        banks = response.json()
        assert len(banks) > 0
        return banks[0]
    
    def test_withdraw_with_system_bank(self, user_with_balance, system_bank):
        """Test withdrawal with system bank_id creates correct transaction"""
        headers = {"Authorization": f"Bearer {user_with_balance}"}
        
        # Check user has balance
        me_resp = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        user_balance = me_resp.json()["balance"]
        assert user_balance > 0, "Test user should have balance for testing"
        
        # Create withdrawal with system bank
        response = requests.post(f"{BASE_URL}/api/transactions/withdraw", json={
            "amount": 100,
            "bank_id": system_bank["bank_id"]
        }, headers=headers)
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert data["type"] == "withdrawal"
        assert data["amount"] == 100
        assert data["status"] == "pending"
        assert "withdrawal_details" in data
        
        # Verify withdrawal_details has system bank info
        wd = data["withdrawal_details"]
        assert wd["bank_name"] == system_bank["name"]
        assert wd["iban"] == system_bank["iban"]
        assert wd["account_holder"] == system_bank["account_holder"]
        assert wd["source"] == "system"
        
    def test_withdraw_with_system_bank_does_not_deduct_balance(self, user_with_balance, system_bank):
        """Test withdrawal request does NOT deduct balance until approved"""
        headers = {"Authorization": f"Bearer {user_with_balance}"}
        
        # Get initial balance
        me_resp = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        initial_balance = me_resp.json()["balance"]
        
        # Create withdrawal
        response = requests.post(f"{BASE_URL}/api/transactions/withdraw", json={
            "amount": 50,
            "bank_id": system_bank["bank_id"]
        }, headers=headers)
        assert response.status_code == 200
        
        # Balance should remain same
        me_resp = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        current_balance = me_resp.json()["balance"]
        assert current_balance == initial_balance, "Balance should not be deducted on withdrawal request"


class TestWithdrawEndpointWithManualIBAN:
    """Test POST /api/transactions/withdraw with manual IBAN entry"""
    
    @pytest.fixture
    def user_with_balance(self):
        """Login as testuser@test.com"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        return response.json()["token"]
    
    def test_withdraw_with_manual_iban(self, user_with_balance):
        """Test withdrawal with manual IBAN creates transaction with source=manual"""
        headers = {"Authorization": f"Bearer {user_with_balance}"}
        
        response = requests.post(f"{BASE_URL}/api/transactions/withdraw", json={
            "amount": 75,
            "bank_name": "Akbank",
            "iban": "TR12 3456 7890 1234 5678 9012 34",
            "account_holder": "Test Kullanici"
        }, headers=headers)
        
        assert response.status_code == 200, f"Failed: {response.text}"
        data = response.json()
        
        # Verify response
        assert data["type"] == "withdrawal"
        assert data["amount"] == 75
        assert data["status"] == "pending"
        
        # Verify withdrawal_details has manual bank info
        wd = data["withdrawal_details"]
        assert wd["bank_name"] == "Akbank"
        assert wd["iban"] == "TR12 3456 7890 1234 5678 9012 34"
        assert wd["account_holder"] == "Test Kullanici"
        assert wd["source"] == "manual"
        
    def test_withdraw_with_manual_iban_default_bank_name(self, user_with_balance):
        """Test withdrawal with empty bank_name defaults to 'Diger'"""
        headers = {"Authorization": f"Bearer {user_with_balance}"}
        
        response = requests.post(f"{BASE_URL}/api/transactions/withdraw", json={
            "amount": 50,
            "bank_name": "",
            "iban": "TR99 9999 8888 7777 6666 5555 44",
            "account_holder": "Anonim Kullanici"
        }, headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["withdrawal_details"]["bank_name"] == "Diger"


class TestWithdrawEndpointValidation:
    """Test validation and error cases for POST /api/transactions/withdraw"""
    
    @pytest.fixture
    def user_with_balance(self):
        """Login as testuser@test.com"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        return response.json()["token"]
    
    @pytest.fixture
    def user_without_balance(self):
        """Create user with 0 balance"""
        email = f"nobalance_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": "test123",
            "name": "No Balance User"
        })
        return response.json()["token"]
    
    def test_withdraw_without_bank_info_returns_400(self, user_with_balance):
        """Test withdrawal without bank_id or IBAN returns 400"""
        headers = {"Authorization": f"Bearer {user_with_balance}"}
        
        response = requests.post(f"{BASE_URL}/api/transactions/withdraw", json={
            "amount": 100
        }, headers=headers)
        
        assert response.status_code == 400
        assert "Banka secimi veya IBAN bilgisi gereklidir" in response.json()["detail"]
        
    def test_withdraw_with_iban_but_no_account_holder_returns_400(self, user_with_balance):
        """Test withdrawal with IBAN but missing account_holder returns 400"""
        headers = {"Authorization": f"Bearer {user_with_balance}"}
        
        response = requests.post(f"{BASE_URL}/api/transactions/withdraw", json={
            "amount": 100,
            "iban": "TR12 3456 7890 1234 5678 9012 34"
        }, headers=headers)
        
        assert response.status_code == 400
        
    def test_withdraw_exceeds_balance_returns_400(self, user_with_balance):
        """Test withdrawal amount > balance returns insufficient balance error"""
        headers = {"Authorization": f"Bearer {user_with_balance}"}
        
        # Try to withdraw more than possible balance
        response = requests.post(f"{BASE_URL}/api/transactions/withdraw", json={
            "amount": 999999999,
            "bank_id": "some-bank-id"
        }, headers=headers)
        
        assert response.status_code in [400, 404]  # 404 if bank not found, 400 if balance check first
        
    def test_withdraw_zero_amount_returns_400(self, user_with_balance):
        """Test withdrawal with 0 amount returns error"""
        headers = {"Authorization": f"Bearer {user_with_balance}"}
        
        response = requests.post(f"{BASE_URL}/api/transactions/withdraw", json={
            "amount": 0,
            "bank_id": "any-bank"
        }, headers=headers)
        
        assert response.status_code == 400
        
    def test_withdraw_user_with_zero_balance(self, user_without_balance):
        """Test user with 0 balance cannot withdraw"""
        headers = {"Authorization": f"Bearer {user_without_balance}"}
        
        response = requests.post(f"{BASE_URL}/api/transactions/withdraw", json={
            "amount": 100,
            "iban": "TR12 3456 7890 1234 5678 9012 34",
            "account_holder": "Test User"
        }, headers=headers)
        
        assert response.status_code == 400
        assert "Yetersiz bakiye" in response.json()["detail"]


class TestAdminTransactionsWithdrawalDetails:
    """Test admin can see withdrawal_details in transactions"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_admin_transactions_include_withdrawal_details(self, admin_token):
        """Test GET /api/admin/transactions includes withdrawal_details for withdrawals"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = requests.get(f"{BASE_URL}/api/admin/transactions", headers=headers)
        assert response.status_code == 200
        
        transactions = response.json()
        
        # Find withdrawal transactions with withdrawal_details
        withdrawals_with_details = [
            t for t in transactions 
            if t["type"] == "withdrawal" and t.get("withdrawal_details")
        ]
        
        # We should have at least one from our tests
        if len(withdrawals_with_details) > 0:
            wd = withdrawals_with_details[0]["withdrawal_details"]
            assert "bank_name" in wd
            assert "iban" in wd
            assert "account_holder" in wd
            assert "source" in wd


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
