from utils.env import has_test_credentials


def test_has_test_credentials_rejects_placeholders(monkeypatch):
    monkeypatch.delenv("E2E_EMAIL", raising=False)
    monkeypatch.delenv("E2E_PASSWORD", raising=False)
    monkeypatch.setenv("E2E_EMAIL", "replace-with-test-account-email")
    monkeypatch.setenv("E2E_PASSWORD", "replace-with-test-account-password")

    assert has_test_credentials() is False


def test_has_test_credentials_accepts_real_values(monkeypatch):
    monkeypatch.setenv("E2E_EMAIL", "user@example.com")
    monkeypatch.setenv("E2E_PASSWORD", "secret123")

    assert has_test_credentials() is True
