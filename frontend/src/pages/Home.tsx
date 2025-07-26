import { 
  Plus,
  Users,
  Globe,
} from 'lucide-react';

function Home() {

  // Mock user data
  const user = {
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    worlds: 12,
    followers: 1240,
    following: 890
  };

  // Mock worlds data
  const recentWorlds = [
    {
      id: 1,
      name: "Cyber District",
      thumbnail: "https://images.unsplash.com/photo-1614066891977-5dc5c8ee6a8d?auto=format&fit=crop&w=600&q=80",
      visitors: 1420,
      lastVisited: "2 hours ago"
    },
    {
      id: 2,
      name: "Zen Garden",
      thumbnail: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&w=600&q=80",
      visitors: 890,
      lastVisited: "1 day ago"
    },
    {
      id: 3,
      name: "Space Hub",
      thumbnail: "https://images.unsplash.com/photo-1633934542430-0905ccb3e95d?auto=format&fit=crop&w=600&q=80",
      visitors: 2150,
      lastVisited: "3 days ago"
    }
  ];


  // Mock activity feed
  const activityFeed = [
    {
      id: 1,
      type: "visit",
      user: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
      },
      world: "Cyber District",
      time: "10 minutes ago"
    },
    {
      id: 2,
      type: "like",
      user: {
        name: "Marcus Zhang",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"
      },
      world: "Zen Garden",
      time: "2 hours ago"
    },
    {
      id: 3,
      type: "comment",
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
      },
      world: "Space Hub",
      comment: "Amazing design! Love the interactive elements.",
      time: "5 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Top Navigation */}
      
      {/* Main Content */}
      <main className="">
        <div className="w-full mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Worlds</h3>
                <Globe className="w-5 h-5 text-primary-light dark:text-primary-dark" />
              </div>
              <p className="text-3xl font-bold">{user.worlds}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active creations</p>
            </div>

            <div className="bg-white  dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Followers</h3>
                <Users className="w-5 h-5 text-primary-light dark:text-primary-dark" />
              </div>
              <p className="text-3xl font-bold">{user.followers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">People following you</p>
            </div>

            <div className="bg-white dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Following</h3>
                <Users className="w-5 h-5 text-primary-light dark:text-primary-dark" />
              </div>
              <p className="text-3xl font-bold">{user.following}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Creators you follow</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Worlds */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Worlds</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" />
                  Create New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentWorlds.map(world => (
                  <div 
                    key={world.id}
                    className="group bg-white dark:bg-black rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={world.thumbnail} 
                        alt={world.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{world.name}</h3>
                          <p className="text-sm text-gray-300">{world.visitors} visitors</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last visited {world.lastVisited}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Activity Feed</h2>
              <div className="bg-white dark:bg-black rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                {activityFeed.map(activity => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-3 p-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <img 
                      src={activity.user.avatar} 
                      alt={activity.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">{activity.user.name}</span>
                        {activity.type === 'visit' && ' visited your world '}
                        {activity.type === 'like' && ' liked your world '}
                        {activity.type === 'comment' && ' commented on '}
                        <span className="font-semibold">{activity.world}</span>
                      </p>
                      {activity.comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          "{activity.comment}"
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



export default Home;
