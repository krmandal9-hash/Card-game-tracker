class GameRecord {
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
