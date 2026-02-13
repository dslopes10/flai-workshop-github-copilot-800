from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Team, Activity, Workout, Leaderboard
from .serializers import (
    UserSerializer, TeamSerializer, ActivitySerializer, 
    WorkoutSerializer, LeaderboardSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing User instances.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['get'])
    def by_team(self, request):
        """Get users filtered by team_id"""
        team_id = request.query_params.get('team_id')
        if team_id:
            users = User.objects.filter(team_id=team_id)
            serializer = self.get_serializer(users, many=True)
            return Response(serializer.data)
        return Response({'error': 'team_id parameter required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        """Get all activities for a specific user"""
        user = self.get_object()
        activities = Activity.objects.filter(user_id=user.username)
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Team instances.
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get all members of a specific team"""
        team = self.get_object()
        users = User.objects.filter(team_id=team._id)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def leaderboard(self, request, pk=None):
        """Get team leaderboard entry"""
        team = self.get_object()
        leaderboard_entry = Leaderboard.objects.filter(
            type='team', 
            team_id=team._id
        ).first()
        if leaderboard_entry:
            serializer = LeaderboardSerializer(leaderboard_entry)
            return Response(serializer.data)
        return Response({'error': 'Leaderboard entry not found'}, 
                       status=status.HTTP_404_NOT_FOUND)


class ActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Activity instances.
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get activities filtered by user_id"""
        user_id = request.query_params.get('user_id')
        if user_id:
            activities = Activity.objects.filter(user_id=user_id)
            serializer = self.get_serializer(activities, many=True)
            return Response(serializer.data)
        return Response({'error': 'user_id parameter required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get activities filtered by type"""
        activity_type = request.query_params.get('type')
        if activity_type:
            activities = Activity.objects.filter(type=activity_type)
            serializer = self.get_serializer(activities, many=True)
            return Response(serializer.data)
        return Response({'error': 'type parameter required'}, 
                       status=status.HTTP_400_BAD_REQUEST)


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Workout instances.
    """
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get workouts filtered by type"""
        workout_type = request.query_params.get('type')
        if workout_type:
            workouts = Workout.objects.filter(type=workout_type)
            serializer = self.get_serializer(workouts, many=True)
            return Response(serializer.data)
        return Response({'error': 'type parameter required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_difficulty(self, request):
        """Get workouts filtered by difficulty"""
        difficulty = request.query_params.get('difficulty')
        if difficulty:
            workouts = Workout.objects.filter(difficulty=difficulty)
            serializer = self.get_serializer(workouts, many=True)
            return Response(serializer.data)
        return Response({'error': 'difficulty parameter required'}, 
                       status=status.HTTP_400_BAD_REQUEST)


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Leaderboard instances (read-only).
    """
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    
    @action(detail=False, methods=['get'])
    def individual(self, request):
        """Get individual leaderboard rankings"""
        leaderboard = Leaderboard.objects.filter(type='individual').order_by('rank')
        serializer = self.get_serializer(leaderboard, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def team(self, request):
        """Get team leaderboard rankings"""
        leaderboard = Leaderboard.objects.filter(type='team').order_by('rank')
        serializer = self.get_serializer(leaderboard, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def top(self, request):
        """Get top N entries from leaderboard"""
        limit = int(request.query_params.get('limit', 10))
        leaderboard_type = request.query_params.get('type', 'individual')
        leaderboard = Leaderboard.objects.filter(
            type=leaderboard_type
        ).order_by('rank')[:limit]
        serializer = self.get_serializer(leaderboard, many=True)
        return Response(serializer.data)
