import 'package:app_ball/Modle/user_model.dart';
import 'package:app_ball/Tab%20bar/tab_bar.dart';
import 'package:app_ball/ipapp.dart';
import 'package:app_ball/register.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberEmail = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadSavedEmail();
  }

  void _loadSavedEmail() async {
    final prefs = await SharedPreferences.getInstance();
   bool rememberEmail = prefs.getBool('remember_email') ?? false; // หากเป็น null ให้ใช้ค่า false แทน

    setState(() {
      _rememberEmail = rememberEmail;
      _emailController.text = rememberEmail ? prefs.getString('saved_email') ?? '' : '';
    });
  }

  void _saveEmail() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('remember_email', _rememberEmail);
    if (_rememberEmail) {
      await prefs.setString('saved_email', _emailController.text);
    } else {
      await prefs.remove('saved_email');
    }
  }

 void _handleLogin() async {
  if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
    _showDialog('ກະລຸນາໃສ່ອີເມວ ແລະ ລະຫັດໃຫ້ຄົບ');
    return;
  }

  setState(() {
    _isLoading = true;
  });

  _saveEmail();

  try {
    final response = await http.post(
      Uri.parse('${Ipapp.baseUrl}/api/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': _emailController.text,
        'password': _passwordController.text,
      }),
    );

    final responseData = jsonDecode(response.body);

    if (response.statusCode == 200) {
      if (responseData != null) {
        // Ensure the response contains valid data
        if (responseData['user'] != null) {
          User user = User.fromJson(responseData['user']);
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => MyTabBar(user: user)),
          );
        } else {
          _showDialog('ຂໍ້ມູນຜິດພາດ');
        }
      } else {
        _showDialog('ຂໍ້ຜິດພາດ');
      }
    } else {
      _showDialog(responseData['msg'] ?? 'ຜິດພາດ');
    }
  } catch (e) {
    _showDialog('ເກີດຂໍ້ຜິດພາດ: $e');
  } finally {
    setState(() {
      _isLoading = false;
    });
  }
}


  void _showDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('ແຈ້ງເຕືອນ'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('ຕົກລົງ'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(color: Colors.green[400]),
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Card(
                elevation: 8,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.network(
                        'https://cdn-icons-png.flaticon.com/512/188/188864.png',
                        width: 96,
                        height: 96,
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'ເຂົ້າສູ່ລະບົບຈອງເດີ່ນ NATHOM',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.green[700],
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 32),

                      // Email TextField
                      TextField(
                        controller: _emailController,
                        decoration: InputDecoration(
                          prefixIcon: Icon(Icons.mail, color: Colors.grey[600]),
                          hintText: 'ຊື່ຜູ້ໃຊ້',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),

                      const SizedBox(height: 16),

                      // Password TextField
                      TextField(
                        controller: _passwordController,
                        decoration: InputDecoration(
                          prefixIcon: Icon(Icons.lock, color: Colors.grey[600]),
                          hintText: 'ລະຫັດ',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword ? Icons.visibility_off : Icons.visibility,
                              color: Colors.grey[600],
                            ),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          ),
                        ),
                        obscureText: _obscurePassword,
                      ),

                      // Remember Email Checkbox
                      Row(
                        children: [
                          Checkbox(
                            value: _rememberEmail,
                            onChanged: (bool? value) {
                              setState(() {
                                _rememberEmail = value ?? false;
                              });
                              _saveEmail();
                            },
                            activeColor: Colors.green[600],
                          ),
                          Text(
                            'ຈົດຈຳອີເມວ',
                            style: TextStyle(color: Colors.green[600]),
                          ),
                        ],
                      ),

                      // Register Option
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('ມີບັນຊີແລ້ວ ຫຼື ບໍ່ ?'),
                          TextButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => RegisterPage()),
                              );
                            },
                            child: Text(
                              'ກົດສະໝັກບັນຊີ',
                              style: TextStyle(color: Colors.green[600]),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // Login Button
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green[500],
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: _isLoading
                              ? CircularProgressIndicator(color: Colors.white)
                              : Text(
                                  'ເຂົ້າສູ່ລະບົບ',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
