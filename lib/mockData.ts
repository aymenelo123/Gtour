export const mockGames = [
  { id: 'chess', title: 'شطرنج', iconName: 'Grid', gradient: 'from-emerald-400 to-teal-800' },
  { id: 'pes', title: 'بيس موبايل', iconName: 'Dribbble', gradient: 'from-purple-500 to-indigo-900' },
  { id: 'clash', title: 'كلاش رويال', iconName: 'Swords', gradient: 'from-orange-400 to-orange-700' },
  { id: 'fc25', title: 'FC 25', iconName: 'Trophy', gradient: 'from-emerald-500 to-emerald-700' },
  { id: 'cs2', title: 'CS2', iconName: 'Crosshair', gradient: 'from-blue-400 to-blue-800' },
  { id: 'nba2k', title: 'NBA 2K', iconName: 'Activity', gradient: 'from-orange-500 to-red-600' },
  { id: 'rl', title: 'Rocket League', iconName: 'Car', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'lol', title: 'League of Legends', iconName: 'Shield', gradient: 'from-yellow-400 to-yellow-700' },
  { id: 'valorant', title: 'Valorant', iconName: 'Target', gradient: 'from-red-500 to-red-900' },
];

export const mockMatches = [
  { id: 101, game: 'chess', player: 'ChessMaster_213', avatar: 'https://i.pravatar.cc/150?u=chessmaster1', amount: 300, status: 'open' },
  { id: 102, game: 'pes', player: 'El_Professor', avatar: 'https://i.pravatar.cc/150?u=pesfan221', amount: 150, status: 'open' },
  { id: 103, game: 'clash', player: 'KingSlayer_X', avatar: 'https://i.pravatar.cc/150?u=clashking2', amount: 500, status: 'open' },
  { id: 104, game: 'fc25', player: 'DZ_Sniper', avatar: 'https://i.pravatar.cc/150?u=dzsniperx', amount: 50, status: 'open' },
  { id: 105, game: 'cs2', player: 'Ghost_Rifle', avatar: 'https://i.pravatar.cc/150?u=ghostrifle', amount: 100, status: 'open' },
  { id: 106, game: 'rl', player: 'BoostPad_Pro', avatar: 'https://i.pravatar.cc/150?u=boostpadpro', amount: 20, status: 'open' },
  { id: 107, game: 'nba2k', player: 'HoopsStar_99', avatar: 'https://i.pravatar.cc/150?u=hoopsstar99', amount: 500, status: 'open' },
  { id: 108, game: 'lol', player: 'MidLaneGod', avatar: 'https://i.pravatar.cc/150?u=midlanegod', amount: 150, status: 'open' },
  { id: 109, game: 'valorant', player: 'Aymen_Jett', avatar: 'https://i.pravatar.cc/150?u=aymenjett', amount: 200, status: 'open' },
  { id: 110, game: 'pes', player: 'ProPlayer_Mobile', avatar: 'https://i.pravatar.cc/150?u=proplayermob', amount: 50, status: 'open' },
  { id: 111, game: 'chess', player: 'Magnus_Arabia', avatar: 'https://i.pravatar.cc/150?u=magnusarab', amount: 100, status: 'open' },
  { id: 112, game: 'fc25', player: 'CR7_Fanatic', avatar: 'https://i.pravatar.cc/150?u=cr7fanatic', amount: 75, status: 'open' },
];

export const mockRecentResults = [
  { id: 1, winner: 'SniperKing', amount: 200, game: 'cs2', time: 'منذ 5 د' },
  { id: 2, winner: 'Aymen123', amount: 100, game: 'fc25', time: 'منذ 15 د' },
  { id: 3, winner: 'MidLaneGod', amount: 300, game: 'lol', time: 'منذ ساعة' },
  { id: 4, winner: 'BoostPad', amount: 40, game: 'rl', time: 'منذ ساعتين' },
];

export const mockTournaments = [
  { id: 1, title: 'بطولة FC 25 الكبرى', game: 'FC 25', prizePool: 1000, entryFee: 10, maxSlots: 64, currentSlots: 45, startsAt: 'اليوم، 21:00' },
  { id: 2, title: 'دوري Rocket League', game: 'Rocket League', prizePool: 500, entryFee: 5, maxSlots: 32, currentSlots: 30, startsAt: 'غدا، 18:00' },
  { id: 3, title: 'تصفيات CS2', game: 'CS2', prizePool: 2000, entryFee: 20, maxSlots: 128, currentSlots: 110, startsAt: 'الجمعة، 15:00' },
];
