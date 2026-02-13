from rest_framework import serializers
from .models import User, Team, Activity, Workout, Leaderboard
import ast


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    stats = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['_id', 'email', 'username', 'full_name', 'team_id', 'role', 
                  'avatar', 'created_at', 'stats']
        read_only_fields = ['_id', 'created_at']
    
    def get_stats(self, obj):
        """Convert stats to proper dict format"""
        if obj.stats is None:
            return {'total_points': 0, 'activities_completed': 0}
        
        # If stats is a string representation, try to parse it
        if isinstance(obj.stats, str):
            try:
                # Try to parse as Python literal (OrderedDict, dict, etc.)
                parsed = ast.literal_eval(obj.stats)
                if isinstance(parsed, dict):
                    # Convert to standard format
                    return {
                        'total_points': parsed.get('total_points', 0),
                        'activities_completed': parsed.get('total_activities', parsed.get('activities_completed', 0))
                    }
            except (ValueError, SyntaxError):
                pass
        
        # If stats is already a dict
        if isinstance(obj.stats, dict):
            return {
                'total_points': obj.stats.get('total_points', 0),
                'activities_completed': obj.stats.get('total_activities', obj.stats.get('activities_completed', 0))
            }
        
        return {'total_points': 0, 'activities_completed': 0}


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team model"""
    members = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['_id', 'name', 'description', 'created_at', 'members']
        read_only_fields = ['created_at']
    
    def get_members(self, obj):
        """Convert members string to list if needed"""
        if isinstance(obj.members, str):
            try:
                return ast.literal_eval(obj.members)
            except (ValueError, SyntaxError):
                return []
        return obj.members if obj.members else []


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model"""
    class Meta:
        model = Activity
        fields = ['_id', 'user_id', 'type', 'duration_minutes', 'distance_km', 
                  'points', 'date', 'notes', 'created_at']
        read_only_fields = ['_id', 'created_at']


class WorkoutSerializer(serializers.ModelSerializer):
    """Serializer for Workout model"""
    exercises = serializers.SerializerMethodField()
    
    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'type', 'duration_minutes', 
                  'difficulty', 'exercises', 'created_at']
        read_only_fields = ['_id', 'created_at']
    
    def get_exercises(self, obj):
        """Convert exercises string to list if needed"""
        if isinstance(obj.exercises, str):
            try:
                return ast.literal_eval(obj.exercises)
            except (ValueError, SyntaxError):
                return []
        return obj.exercises if obj.exercises else []


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for Leaderboard model"""
    class Meta:
        model = Leaderboard
        fields = ['_id', 'type', 'user_id', 'team_id', 'full_name', 'team_name', 
                  'points', 'activities_count', 'members_count', 'rank', 'updated_at']
        read_only_fields = ['_id', 'updated_at']
