class Player {
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
