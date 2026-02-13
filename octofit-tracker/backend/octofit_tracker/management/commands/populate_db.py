from django.core.management.base import BaseCommand
from pymongo import MongoClient, ASCENDING
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']
        
        self.stdout.write(self.style.SUCCESS('Connected to octofit_db'))
        
        # Clear existing collections
        self.stdout.write('Clearing existing collections...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})
        
        # Create unique index on email field for users collection
        db.users.create_index([("email", ASCENDING)], unique=True)
        self.stdout.write(self.style.SUCCESS('Created unique index on email field'))
        
        # Create Teams
        teams_data = [
            {
                '_id': 'team_marvel',
                'name': 'Team Marvel',
                'description': 'Earth\'s Mightiest Heroes',
                'created_at': datetime.now(),
                'members': []
            },
            {
                '_id': 'team_dc',
                'name': 'Team DC',
                'description': 'Justice League United',
                'created_at': datetime.now(),
                'members': []
            }
        ]
        db.teams.insert_many(teams_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(teams_data)} teams'))
        
        # Create Users (Superheroes)
        users_data = [
            # Team Marvel
            {
                'email': 'tony.stark@marvel.com',
                'username': 'ironman',
                'full_name': 'Tony Stark',
                'team_id': 'team_marvel',
                'role': 'hero',
                'avatar': 'ironman.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'steve.rogers@marvel.com',
                'username': 'captainamerica',
                'full_name': 'Steve Rogers',
                'team_id': 'team_marvel',
                'role': 'hero',
                'avatar': 'captainamerica.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'thor.odinson@marvel.com',
                'username': 'thor',
                'full_name': 'Thor Odinson',
                'team_id': 'team_marvel',
                'role': 'hero',
                'avatar': 'thor.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'bruce.banner@marvel.com',
                'username': 'hulk',
                'full_name': 'Bruce Banner',
                'team_id': 'team_marvel',
                'role': 'hero',
                'avatar': 'hulk.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'natasha.romanoff@marvel.com',
                'username': 'blackwidow',
                'full_name': 'Natasha Romanoff',
                'team_id': 'team_marvel',
                'role': 'hero',
                'avatar': 'blackwidow.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'peter.parker@marvel.com',
                'username': 'spiderman',
                'full_name': 'Peter Parker',
                'team_id': 'team_marvel',
                'role': 'hero',
                'avatar': 'spiderman.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            # Team DC
            {
                'email': 'bruce.wayne@dc.com',
                'username': 'batman',
                'full_name': 'Bruce Wayne',
                'team_id': 'team_dc',
                'role': 'hero',
                'avatar': 'batman.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'clark.kent@dc.com',
                'username': 'superman',
                'full_name': 'Clark Kent',
                'team_id': 'team_dc',
                'role': 'hero',
                'avatar': 'superman.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'diana.prince@dc.com',
                'username': 'wonderwoman',
                'full_name': 'Diana Prince',
                'team_id': 'team_dc',
                'role': 'hero',
                'avatar': 'wonderwoman.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'barry.allen@dc.com',
                'username': 'flash',
                'full_name': 'Barry Allen',
                'team_id': 'team_dc',
                'role': 'hero',
                'avatar': 'flash.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'arthur.curry@dc.com',
                'username': 'aquaman',
                'full_name': 'Arthur Curry',
                'team_id': 'team_dc',
                'role': 'hero',
                'avatar': 'aquaman.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            },
            {
                'email': 'hal.jordan@dc.com',
                'username': 'greenlantern',
                'full_name': 'Hal Jordan',
                'team_id': 'team_dc',
                'role': 'hero',
                'avatar': 'greenlantern.png',
                'created_at': datetime.now(),
                'stats': {'total_activities': 0, 'total_points': 0}
            }
        ]
        
        result = db.users.insert_many(users_data)
        user_ids = result.inserted_ids
        self.stdout.write(self.style.SUCCESS(f'Created {len(users_data)} users'))
        
        # Update teams with member IDs
        marvel_members = [users_data[i]['username'] for i in range(6)]
        dc_members = [users_data[i]['username'] for i in range(6, 12)]
        
        db.teams.update_one({'_id': 'team_marvel'}, {'$set': {'members': marvel_members}})
        db.teams.update_one({'_id': 'team_dc'}, {'$set': {'members': dc_members}})
        
        # Create Workouts
        workouts_data = [
            {
                'name': 'Avengers Assemble',
                'description': 'High-intensity superhero training',
                'type': 'strength',
                'duration_minutes': 45,
                'difficulty': 'hard',
                'exercises': ['push-ups', 'squats', 'burpees', 'planks'],
                'created_at': datetime.now()
            },
            {
                'name': 'Web-Slinger Circuit',
                'description': 'Agility and flexibility workout',
                'type': 'cardio',
                'duration_minutes': 30,
                'difficulty': 'medium',
                'exercises': ['jumping jacks', 'mountain climbers', 'high knees'],
                'created_at': datetime.now()
            },
            {
                'name': 'Justice League Power Hour',
                'description': 'Full-body strength training',
                'type': 'strength',
                'duration_minutes': 60,
                'difficulty': 'hard',
                'exercises': ['deadlifts', 'bench press', 'pull-ups', 'squats'],
                'created_at': datetime.now()
            },
            {
                'name': 'Speed Force Sprint',
                'description': 'Speed and endurance training',
                'type': 'cardio',
                'duration_minutes': 20,
                'difficulty': 'medium',
                'exercises': ['sprints', 'lunges', 'jump rope'],
                'created_at': datetime.now()
            },
            {
                'name': 'Kryptonian Core',
                'description': 'Core strength and stability',
                'type': 'flexibility',
                'duration_minutes': 25,
                'difficulty': 'easy',
                'exercises': ['planks', 'crunches', 'leg raises', 'russian twists'],
                'created_at': datetime.now()
            }
        ]
        
        result = db.workouts.insert_many(workouts_data)
        workout_ids = result.inserted_ids
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts_data)} workouts'))
        
        # Create Activities
        activities_data = []
        activity_types = ['running', 'cycling', 'swimming', 'strength_training', 'yoga']
        
        for i, user in enumerate(users_data):
            num_activities = random.randint(3, 8)
            for j in range(num_activities):
                days_ago = random.randint(1, 30)
                activity_date = datetime.now() - timedelta(days=days_ago)
                duration = random.randint(20, 90)
                distance = round(random.uniform(2.0, 15.0), 2) if random.choice([True, False]) else None
                points = duration + (distance * 10 if distance else 0)
                
                activity = {
                    'user_id': user['username'],
                    'type': random.choice(activity_types),
                    'duration_minutes': duration,
                    'distance_km': distance,
                    'points': int(points),
                    'date': activity_date,
                    'notes': f'Training session for {user["full_name"]}',
                    'created_at': activity_date
                }
                activities_data.append(activity)
                
                # Update user stats
                db.users.update_one(
                    {'username': user['username']},
                    {
                        '$inc': {
                            'stats.total_activities': 1,
                            'stats.total_points': int(points)
                        }
                    }
                )
        
        db.activities.insert_many(activities_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(activities_data)} activities'))
        
        # Create Leaderboard
        leaderboard_data = []
        
        # Individual leaderboard
        for user in users_data:
            user_stats = db.users.find_one({'username': user['username']})
            leaderboard_data.append({
                'type': 'individual',
                'user_id': user['username'],
                'team_id': user['team_id'],
                'full_name': user['full_name'],
                'points': user_stats['stats']['total_points'],
                'activities_count': user_stats['stats']['total_activities'],
                'rank': 0,  # Will be calculated
                'updated_at': datetime.now()
            })
        
        # Sort by points and assign ranks
        leaderboard_data.sort(key=lambda x: x['points'], reverse=True)
        for idx, entry in enumerate(leaderboard_data):
            entry['rank'] = idx + 1
        
        # Team leaderboard
        marvel_points = sum(entry['points'] for entry in leaderboard_data if entry['team_id'] == 'team_marvel')
        dc_points = sum(entry['points'] for entry in leaderboard_data if entry['team_id'] == 'team_dc')
        
        leaderboard_data.extend([
            {
                'type': 'team',
                'team_id': 'team_marvel',
                'team_name': 'Team Marvel',
                'points': marvel_points,
                'members_count': 6,
                'rank': 1 if marvel_points > dc_points else 2,
                'updated_at': datetime.now()
            },
            {
                'type': 'team',
                'team_id': 'team_dc',
                'team_name': 'Team DC',
                'points': dc_points,
                'members_count': 6,
                'rank': 1 if dc_points > marvel_points else 2,
                'updated_at': datetime.now()
            }
        ])
        
        db.leaderboard.insert_many(leaderboard_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard_data)} leaderboard entries'))
        
        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('Database population complete!'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(f'Collections created:')
        self.stdout.write(f'  - users: {db.users.count_documents({})} documents')
        self.stdout.write(f'  - teams: {db.teams.count_documents({})} documents')
        self.stdout.write(f'  - activities: {db.activities.count_documents({})} documents')
        self.stdout.write(f'  - workouts: {db.workouts.count_documents({})} documents')
        self.stdout.write(f'  - leaderboard: {db.leaderboard.count_documents({})} documents')
        
        client.close()
