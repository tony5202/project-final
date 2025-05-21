import 'package:app_ball/Modle/user_model.dart';
import 'package:app_ball/home.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fluttertoast/fluttertoast.dart';


class Profile extends StatefulWidget {
  final User user;
  const Profile({super.key, required this.user});

  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    Fluttertoast.showToast(
      msg: 'ອອກຈາກລະບົບສຳເລັດ',
      toastLength: Toast.LENGTH_LONG,
      gravity: ToastGravity.TOP,
      backgroundColor: Colors.red[600], // Changed to red for logout
      textColor: Colors.white,
      fontSize: 16.0,
    );

    if (mounted) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) =>  Home()),
        (route) => false,
      );
    }
  }
void confirmLogout(BuildContext context) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: const Text('ຢືນຢັນການອອກຈາກລະບົບ'),
        content: const Text('ທ່ານແນ່ໃຈບໍ່ວ່າຈະອອກຈາກລະບົບ?'),
        actions: <Widget>[
          TextButton(
            child: const Text('ຍົກເລີກ'),
            onPressed: () {
              Navigator.of(context).pop(); // ปิด dialog
            },
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red[600],
            ),
            child: const Text('ອອກຈາກລະບົບ'),
            onPressed: () {
              Navigator.of(context).pop(); // ปิด dialog ก่อน logout
              _logout(context); // ดำเนินการ logout
            },
          ),
        ],
      );
    },
  );
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ຂໍ້ມູນຂອງຂ້ອຍ'),
        backgroundColor: Colors.green[700],
        elevation: 4,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green[100]!, Colors.green[300]!],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              const SizedBox(height: 16),
              CircleAvatar(
                radius: 50,
                backgroundColor: Colors.green[200],
                child: Text(
                  widget.user.username.isNotEmpty ? widget.user.username[0].toUpperCase() : '?',
                  style: const TextStyle(fontSize: 40, color: Colors.white),
                ),
              ),
              const SizedBox(height: 16),
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.person, color: Colors.green, size: 30),
                          SizedBox(width: 8),
                          Text(
                            'ຂໍ້ມູນຜູ້ໃຊ້',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      _buildProfileField('ຊື່ຜູ້ໃຊ້', widget.user.username),
                      _buildProfileField('ຊື່', widget.user.name ?? 'ບໍ່ມີຂໍ້ມູນ'),
                      _buildProfileField('ອີເມວ', widget.user.email),
                      _buildProfileField('ເບີໂທ', widget.user.phone),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => confirmLogout(context),
                icon: const Icon(Icons.logout, color: Colors.white),
                label: const Text(
                  'ອອກຈາກລະບົບ',
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red[600],
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  elevation: 4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 16,
                color: Colors.black87,
              ),
            ),
          ),
        ],
      ),
    );
  }
}