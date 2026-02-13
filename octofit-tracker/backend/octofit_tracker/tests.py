from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from datetime import datetime
from .models import User, Team, Activity, Workout, Leaderboard


class UserModelTest(TestCase):
    """Test cases for User model"""
    
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'full_name': 'Test User',
            'team_id': 'team_test',
            'role': 'hero',
            'stats': {'total_activities': 0, 'total_points': 0}
        }
    
    def test_user_creation(self):
        """Test creating a user"""
        user = User.objects.create(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(str(user), 'Test User (testuser)')


class TeamModelTest(TestCase):
    """Test cases for Team model"""
    
    def setUp(self):
        self.team_data = {
            '_id': 'team_test',
            'name': 'Test Team',
            'description': 'A test team',
            'members': []
        }
    
    def test_team_creation(self):
        """Test creating a team"""
        team = Team.objects.create(**self.team_data)
        self.assertEqual(team.name, 'Test Team')
        self.assertEqual(str(team), 'Test Team')


class ActivityModelTest(TestCase):
    """Test cases for Activity model"""
    
    def setUp(self):
        self.activity_data = {
            'user_id': 'testuser',
            'type': 'running',
            'duration_minutes': 30,
            'distance_km': 5.0,
            'points': 80,
            'date': datetime.now(),
            'notes': 'Morning run'
        }
    
    def test_activity_creation(self):
        """Test creating an activity"""
        activity = Activity.objects.create(**self.activity_data)
        self.assertEqual(activity.user_id, 'testuser')
        self.assertEqual(activity.type, 'running')
        self.assertEqual(activity.duration_minutes, 30)


class WorkoutModelTest(TestCase):
    """Test cases for Workout model"""
    
    def setUp(self):
        self.workout_data = {
            'name': 'Test Workout',
            'description': 'A test workout',
            'type': 'strength',
            'duration_minutes': 45,
            'difficulty': 'medium',
            'exercises': ['push-ups', 'squats']
        }
    
    def test_workout_creation(self):
        """Test creating a workout"""
        workout = Workout.objects.create(**self.workout_data)
        self.assertEqual(workout.name, 'Test Workout')
        self.assertEqual(workout.type, 'strength')


class LeaderboardModelTest(TestCase):
    """Test cases for Leaderboard model"""
    
    def setUp(self):
        self.leaderboard_data = {
            'type': 'individual',
            'user_id': 'testuser',
            'full_name': 'Test User',
            'points': 100,
            'activities_count': 5,
            'rank': 1
        }
    
    def test_leaderboard_creation(self):
        """Test creating a leaderboard entry"""
        entry = Leaderboard.objects.create(**self.leaderboard_data)
        self.assertEqual(entry.type, 'individual')
        self.assertEqual(entry.rank, 1)


class UserAPITest(APITestCase):
    """Test cases for User API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'api@example.com',
            'username': 'apiuser',
            'full_name': 'API User',
            'team_id': 'team_test',
            'role': 'hero',
            'stats': {'total_activities': 0, 'total_points': 0}
        }
        self.user = User.objects.create(**self.user_data)
    
    def test_get_users_list(self):
        """Test getting list of users"""
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TeamAPITest(APITestCase):
    """Test cases for Team API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.team_data = {
            '_id': 'team_api',
            'name': 'API Team',
            'description': 'API test team',
            'members': []
        }
        self.team = Team.objects.create(**self.team_data)
    
    def test_get_teams_list(self):
        """Test getting list of teams"""
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    """Test cases for Activity API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.activity_data = {
            'user_id': 'testuser',
            'type': 'running',
            'duration_minutes': 30,
            'distance_km': 5.0,
            'points': 80,
            'date': datetime.now(),
        }
        self.activity = Activity.objects.create(**self.activity_data)
    
    def test_get_activities_list(self):
        """Test getting list of activities"""
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    """Test cases for Workout API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.workout_data = {
            'name': 'API Workout',
            'type': 'cardio',
            'duration_minutes': 30,
            'difficulty': 'easy',
            'exercises': ['jumping jacks']
        }
        self.workout = Workout.objects.create(**self.workout_data)
    
    def test_get_workouts_list(self):
        """Test getting list of workouts"""
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    """Test cases for Leaderboard API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.leaderboard_data = {
            'type': 'individual',
            'user_id': 'testuser',
            'full_name': 'Test User',
            'points': 100,
            'activities_count': 5,
            'rank': 1
        }
        self.entry = Leaderboard.objects.create(**self.leaderboard_data)
    
    def test_get_leaderboard_list(self):
        """Test getting leaderboard"""
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_individual_leaderboard(self):
        """Test getting individual leaderboard"""
        url = reverse('leaderboard-individual')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTest(APITestCase):
    """Test cases for API root endpoint"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_api_root(self):
        """Test API root endpoint"""
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('workouts', response.data)
        self.assertIn('leaderboard', response.data)
