"""Page Object Models (POM) package.

Exposes all page object classes so that downstream modules, fixtures, and
tests can import them from the ``pages`` package (e.g.
``from pages import DashboardPage``) without referencing internal paths.
"""

from .base_page import BasePage
from .dashboard_page import DashboardPage
from .login_page import LoginPage
from .meetings_page import MeetingsPage
from .notetaker_page import NotetakerPage
from .profile_page import ProfilePage
from .register_page import RegistrationPage

__all__ = ["BasePage", "DashboardPage", "LoginPage", "MeetingsPage", "NotetakerPage", "ProfilePage", "RegistrationPage"]
