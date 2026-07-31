import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/game_provider.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final gameProvider = Provider.of<GameProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Edit Player Names',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ...gameProvider.players.map(
            (player) => Padding(
              padding: const EdgeInsets.only(bottom: 12.0),
              child: TextFormField(
                initialValue: player.name,
                decoration: InputDecoration(
                  labelText: 'Player ID: ${player.id}',
                  border: const OutlineInputBorder(),
                ),
                onChanged: (val) {
                  gameProvider.updatePlayerName(player.id, val);
                },
              ),
            ),
          ),
          const Divider(height: 32),
          ListTile(
            leading: const Icon(Icons.refresh, color: Colors.redAccent),
            title: const Text('Reset All Data', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
            subtitle: const Text('Clears history and resets balances to ₹0'),
            onTap: () {
              _showResetDialog(context, gameProvider);
            },
          ),
        ],
      ),
    );
  }

  void _showResetDialog(BuildContext context, GameProvider provider) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reset All Data?'),
        content: const Text('This will clear all history records and reset all 5 player balances back to ₹0.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              Navigator.pop(ctx);
              provider.resetAllData();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('All data has been reset.')),
              );
            },
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }
}
