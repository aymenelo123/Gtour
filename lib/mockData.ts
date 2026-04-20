export const mockGames = [
  { id: 'fc25', title: 'FC 25', icon: '⚽' },
  { id: 'cs2', title: 'CS2', icon: '🔫' },
  { id: 'nba2k', title: 'NBA 2K', icon: '🏀' },
  { id: 'rl', title: 'Rocket League', icon: '🏎️' },
  { id: 'lol', title: 'League of Legends', icon: '⚔️' },
  { id: 'valorant', title: 'Valorant', icon: '🎯' },
];

export const mockMatches = [
  { id: 1, game: 'fc25', player: 'Aymen123', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', amount: 50, status: 'open' },
  { id: 2, game: 'cs2', player: 'SniperKing', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', amount: 100, status: 'open' },
  { id: 3, game: 'rl', player: 'BoostPad', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', amount: 20, status: 'open' },
  { id: 4, game: 'nba2k', player: 'HoopsStar', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', amount: 500, status: 'open' },
  { id: 5, game: 'lol', player: 'MidLaneGod', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', amount: 150, status: 'open' },
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
