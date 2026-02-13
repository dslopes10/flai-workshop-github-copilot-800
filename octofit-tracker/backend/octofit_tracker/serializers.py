from rest_framework import serializers
from .models import User, Team, Activity, Workout, Leaderboard


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['_id', 'email', 'username', 'full_name', 'team_id', 'role', 
                  'avatar', 'created_at', 'stats']
        read_only_fields = ['_id', 'created_at']


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team model"""
    class Meta:
        model = Team
        fields = ['_id', 'name', 'description', 'created_at', 'members']
        read_only_fields = ['created_at']


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model"""
    class Meta:
        model = Activity
        fields = ['_id', 'user_id', 'type', 'duration_minutes', 'distance_km', 
                  'points', 'date', 'notes', 'created_at']
        read_only_fields = ['_id', 'created_at']


class WorkoutSerializer(serializers.ModelSerializer):
    """Serializer for Workout model"""
    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'type', 'duration_minutes', 
                  'difficulty', 'exercises', 'created_at']
        read_only_fields = ['_id', 'created_at']


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for Leaderboard model"""
    class Meta:
        model = Leaderboard
        fields = ['_id', 'type', 'user_id', 'team_id', 'full_name', 'team_name', 
                  'points', 'activities_count', 'members_count', 'rank', 'updated_at']
        read_only_fields = ['_id', 'updated_at']
