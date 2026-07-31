export interface FlutterFile {
  filename: string;
  path: string;
  language: string;
  content: string;
}

export function generateFlutterProjectFiles(): FlutterFile[] {
  return [
    {
      filename: 'pubspec.yaml',
      path: 'pubspec.yaml',
      language: 'yaml',
      content: `name: card_game_tracker
description: "A complete Material 3 Card Game Tracker app with Provider and Hive offline storage."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  intl: ^0.19.0
  google_fonts: ^6.1.0
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  hive_generator: ^2.0.1
  build_runner: ^2.4.8
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`
    },
    {
      filename: 'main.dart',
      path: 'lib/main.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/game_provider.dart';
import 'screens/home_screen.dart';
import 'screens/history_screen.dart';
import 'screens/settings_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive offline storage
  await Hive.initFlutter();
  await GameProvider.initHive();

  runApp(const CardGameTrackerApp());
}

class CardGameTrackerApp extends StatelessWidget {
  const CardGameTrackerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => GameProvider(),
      child: MaterialApp(
        title: 'Card Game Tracker',
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.dark,
        darkTheme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFFD0BCFF),
            brightness: Brightness.dark,
            surface: const Color(0xFF141218),
            surfaceContainer: const Color(0xFF211F26),
            surfaceContainerHigh: const Color(0xFF2B2930),
          ),
          textTheme: GoogleFonts.plusJakartaSansTextTheme(
            ThemeData.dark().textTheme,
          ),
        ),
        home: const MainNavigationScreen(),
      ),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    HistoryScreen(),
    SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.style_outlined),
            selectedIcon: Icon(Icons.style),
            label: 'Game',
          ),
          NavigationDestination(
            icon: Icon(Icons.history_outlined),
            selectedIcon: Icon(Icons.history),
            label: 'History',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
`
    },
    {
      filename: 'game_provider.dart',
      path: 'lib/providers/game_provider.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/player.dart';
import '../models/game_record.dart';

class GameProvider extends ChangeNotifier {
  static const String playersBoxName = 'players_box';
  static const String historyBoxName = 'history_box';
  static const String settingsBoxName = 'settings_box';

  List<Player> _players = [];
  List<GameRecord> _history = [];
  bool _isDoublePrice = false;
  int _baseStake = 300;

  List<Player> get players => _players;
  List<GameRecord> get history => _history;
  bool get isDoublePrice => _isDoublePrice;
  int get baseStake => _baseStake;

  int get effectiveWinnerGain => _isDoublePrice ? (_baseStake * 2 * 4) : (_baseStake * 4);
  int get effectiveLoserLoss => _isDoublePrice ? (_baseStake * 2) : _baseStake;

  static Future<void> initHive() async {
    await Hive.openBox(playersBoxName);
    await Hive.openBox(historyBoxName);
    await Hive.openBox(settingsBoxName);
  }

  GameProvider() {
    _loadFromHive();
  }

  void _loadFromHive() {
    final playersBox = Hive.box(playersBoxName);
    final historyBox = Hive.box(historyBoxName);
    final settingsBox = Hive.box(settingsBoxName);

    _isDoublePrice = settingsBox.get('isDoublePrice', defaultValue: false);
    _baseStake = settingsBox.get('baseStake', defaultValue: 300);

    final savedPlayers = playersBox.get('players');
    if (savedPlayers != null && (savedPlayers as List).isNotEmpty) {
      _players = (savedPlayers as List).map((p) => Player.fromMap(Map<String, dynamic>.from(p))).toList();
    } else {
      _initDefaultPlayers();
    }

    final savedHistory = historyBox.get('history');
    if (savedHistory != null) {
      _history = (savedHistory as List).map((h) => GameRecord.fromMap(Map<String, dynamic>.from(h))).toList();
    }

    notifyListeners();
  }

  void _initDefaultPlayers() {
    _players = [
      Player(id: 'p1', name: 'Player 1', balance: 0, wins: 0, colorHex: 'D0BCFF'),
      Player(id: 'p2', name: 'Player 2', balance: 0, wins: 0, colorHex: 'A8C7FA'),
      Player(id: 'p3', name: 'Player 3', balance: 0, wins: 0, colorHex: 'EFB8C8'),
      Player(id: 'p4', name: 'Player 4', balance: 0, wins: 0, colorHex: '81C784'),
      Player(id: 'p5', name: 'Player 5', balance: 0, wins: 0, colorHex: 'FFB74D'),
    ];
    _savePlayersToHive();
  }

  void toggleDoublePrice() {
    _isDoublePrice = !_isDoublePrice;
    Hive.box(settingsBoxName).put('isDoublePrice', _isDoublePrice);
    notifyListeners();
  }

  void updatePlayerName(String id, String newName) {
    final index = _players.indexWhere((p) => p.id == id);
    if (index != -1 && newName.trim().isNotEmpty) {
      _players[index].name = newName.trim();
      _savePlayersToHive();
      notifyListeners();
    }
  }

  void recordWin(String winnerId) {
    final winner = _players.firstWhere((p) => p.id == winnerId);
    final winnerGain = effectiveWinnerGain;
    final loserLoss = effectiveLoserLoss;

    // Update player balances & win counts
    for (var player in _players) {
      if (player.id == winnerId) {
        player.balance += winnerGain;
        player.wins += 1;
      } else {
        player.balance -= loserLoss;
      }
    }

    // Create history record
    final record = GameRecord(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      roundNumber: _history.length + 1,
      timestamp: DateTime.now().toIso8601String(),
      winnerId: winnerId,
      winnerName: winner.name,
      isDouble: _isDoublePrice,
      baseStake: _baseStake,
      winnerPayout: winnerGain,
      loserLoss: loserLoss,
    );

    _history.insert(0, record);

    _savePlayersToHive();
    _saveHistoryToHive();
    notifyListeners();
  }

  bool undoLastGame() {
    if (_history.isEmpty) return false;

    final lastRecord = _history.removeAt(0);

    for (var player in _players) {
      if (player.id == lastRecord.winnerId) {
        player.balance -= lastRecord.winnerPayout;
        player.wins = (player.wins - 1).clamp(0, 999999);
      } else {
        player.balance += lastRecord.loserLoss;
      }
    }

    _savePlayersToHive();
    _saveHistoryToHive();
    notifyListeners();
    return true;
  }

  void resetAllData({bool keepNames = true}) {
    _history.clear();
    for (int i = 0; i < _players.length; i++) {
      _players[i].balance = 0;
      _players[i].wins = 0;
      if (!keepNames) {
        _players[i].name = 'Player \${i + 1}';
      }
    }

    _savePlayersToHive();
    _saveHistoryToHive();
    notifyListeners();
  }

  void _savePlayersToHive() {
    Hive.box(playersBoxName).put('players', _players.map((p) => p.toMap()).toList());
  }

  void _saveHistoryToHive() {
    Hive.box(historyBoxName).put('history', _history.map((h) => h.toMap()).toList());
  }
}
`
    },
    {
      filename: 'player.dart',
      path: 'lib/models/player.dart',
      language: 'dart',
      content: `class Player {
  final String id;
  String name;
  int balance;
  int wins;
  final String colorHex;

  Player({
    required this.id,
    required this.name,
    this.balance = 0,
    this.wins = 0,
    required this.colorHex,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'balance': balance,
      'wins': wins,
      'colorHex': colorHex,
    };
  }

  factory Player.fromMap(Map<String, dynamic> map) {
    return Player(
      id: map['id'],
      name: map['name'],
      balance: map['balance'] ?? 0,
      wins: map['wins'] ?? 0,
      colorHex: map['colorHex'] ?? 'D0BCFF',
    );
  }
}
`
    },
    {
      filename: 'game_record.dart',
      path: 'lib/models/game_record.dart',
      language: 'dart',
      content: `class GameRecord {
  final String id;
  final int roundNumber;
  final String timestamp;
  final String winnerId;
  final String winnerName;
  final bool isDouble;
  final int baseStake;
  final int winnerPayout;
  final int loserLoss;

  GameRecord({
    required this.id,
    required this.roundNumber,
    required this.timestamp,
    required this.winnerId,
    required this.winnerName,
    required this.isDouble,
    required this.baseStake,
    required this.winnerPayout,
    required this.loserLoss,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'roundNumber': roundNumber,
      'timestamp': timestamp,
      'winnerId': winnerId,
      'winnerName': winnerName,
      'isDouble': isDouble,
      'baseStake': baseStake,
      'winnerPayout': winnerPayout,
      'loserLoss': loserLoss,
    };
  }

  factory GameRecord.fromMap(Map<String, dynamic> map) {
    return GameRecord(
      id: map['id'],
      roundNumber: map['roundNumber'] ?? 1,
      timestamp: map['timestamp'],
      winnerId: map['winnerId'],
      winnerName: map['winnerName'],
      isDouble: map['isDouble'] ?? false,
      baseStake: map['baseStake'] ?? 300,
      winnerPayout: map['winnerPayout'] ?? 1200,
      loserLoss: map['loserLoss'] ?? 300,
    );
  }
}
`
    },
    {
      filename: 'home_screen.dart',
      path: 'lib/screens/home_screen.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final gameProvider = Provider.of<GameProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Card Game Tracker'),
        centerTitle: false,
        actions: [
          if (gameProvider.history.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.undo),
              tooltip: 'Undo Last Game',
              onPressed: () {
                final success = gameProvider.undoLastGame();
                if (success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Undid last game round.')),
                  );
                }
              },
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Double Price Banner Card
            Card(
              elevation: 0,
              color: Theme.of(context).colorScheme.surfaceContainerHigh,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Double Price',
                                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.horizontal(8, 2),
                                decoration: BoxDecoration(
                                  color: gameProvider.isDoublePrice
                                      ? Colors.amber.withOpacity(0.2)
                                      : Colors.grey.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  gameProvider.isDoublePrice ? '2X MULTIPLIER' : '1X REGULAR',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: gameProvider.isDoublePrice ? Colors.amber : Colors.grey,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            gameProvider.isDoublePrice
                                ? 'Winner gets +₹2,400 | Others lose -₹600'
                                : 'Winner gets +₹1,200 | Others lose -₹300',
                            style: TextStyle(
                              fontSize: 12,
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Switch(
                      value: gameProvider.isDoublePrice,
                      onChanged: (_) => gameProvider.toggleDoublePrice(),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Title
            Text(
              'Select Round Winner',
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 12),

            // 5 Player Cards Grid
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: gameProvider.players.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final player = gameProvider.players[index];
                final isPositive = player.balance > 0;
                final isNegative = player.balance < 0;

                return Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () => _showConfirmDialog(context, gameProvider, player.id, player.name),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 24,
                            backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                            child: Text(
                              player.name.substring(0, 1).toUpperCase(),
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.onPrimaryContainer,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  player.name,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '\${player.wins} \${player.wins == 1 ? "win" : "wins"}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                isPositive ? '+₹\${player.balance}' : (isNegative ? '-₹\${player.balance.abs()}' : '₹0'),
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: isPositive
                                      ? Colors.greenAccent
                                      : (isNegative ? Colors.redAccent : Colors.grey),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Tap to Mark Winner',
                                style: TextStyle(
                                  fontSize: 10,
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          _showWinnerSelectBottomSheet(context, gameProvider);
        },
        icon: const Icon(Icons.add_task),
        label: const Text('Add Game Winner'),
      ),
    );
  }

  void _showConfirmDialog(BuildContext context, GameProvider provider, String winnerId, String winnerName) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Confirm Winner: \$winnerName'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Stake Mode: \${provider.isDoublePrice ? "DOUBLE (2x)" : "NORMAL (1x)"}'),
            const SizedBox(height: 8),
            Text('• Winner (\$winnerName): +\${provider.effectiveWinnerGain}'),
            Text('• Other 4 Players: -\${provider.effectiveLoserLoss} each'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(ctx);
              provider.recordWin(winnerId);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Recorded win for \$winnerName!')),
              );
            },
            child: const Text('Confirm & Save'),
          ),
        ],
      ),
    );
  }

  void _showWinnerSelectBottomSheet(BuildContext context, GameProvider provider) {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Round Winner',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            ...provider.players.map((p) => ListTile(
                  leading: const Icon(Icons.emoji_events, color: Colors.amber),
                  title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    Navigator.pop(ctx);
                    _showConfirmDialog(context, provider, p.id, p.name);
                  },
                )),
          ],
        ),
      ),
    );
  }
}
`
    }
  ];
}
