import 'package:flutter/material.dart';
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

    for (var player in _players) {
      if (player.id == winnerId) {
        player.balance += winnerGain;
        player.wins += 1;
      } else {
        player.balance -= loserLoss;
      }
    }

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
        _players[i].name = 'Player ${i + 1}';
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
