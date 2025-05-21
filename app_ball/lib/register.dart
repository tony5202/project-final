import 'package:app_ball/ipapp.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:logger/logger.dart';

class RegisterPage extends HookWidget {
  const RegisterPage({super.key});

  Future<void> registerUser(
    BuildContext context,
    TextEditingController usernameController,
    TextEditingController passwordController,
    TextEditingController confirmPasswordController,
    TextEditingController nameController,
    TextEditingController emailController,
    TextEditingController phoneController,
    GlobalKey<FormState> formKey,
    ValueNotifier<bool> isLoading, // Added for loading state
  ) async {
    final username = usernameController.text.trim();
    final password = passwordController.text.trim();
    final confirmPassword = confirmPasswordController.text.trim();
    final name = nameController.text.trim();
    final email = emailController.text.trim();
    final phone = phoneController.text.trim();
    final logger = Logger();

    if (!formKey.currentState!.validate()) {
      return;
    }

    if (password != confirmPassword) {
      Fluttertoast.showToast(
        msg: 'ລະຫັດຜ່ານບໍ່ກົງກັນ',
        backgroundColor: Colors.red[600],
        textColor: Colors.white,
        gravity: ToastGravity.TOP,
        fontSize: 16,
      );
      return;
    }

    isLoading.value = true; // Start loading
    final url = Uri.parse('${Ipapp.baseUrl}/api/register'); // Updated endpoint
    logger.i('Registering user: URL=$url, Username=$username');

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: json.encode({
          "username": username,
          "password": password,
          "name": name,
          "email": email,
          "phone": phone,
        }),
      ).timeout(const Duration(seconds: 10));

      logger.i('Register Response: ${response.statusCode}, Body: ${response.body}');

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        Fluttertoast.showToast(
          msg: 'ສະໝັກສຳເລັດ! ກະລຸນາເຂົ້າສູ່ລະບົບ',
          backgroundColor: Colors.green[600],
          textColor: Colors.white,
          gravity: ToastGravity.TOP,
          fontSize: 16,
        );
        if (context.mounted) {
          Navigator.pop(context, username);
        }
      } else {
        String msg = data['msg'] ?? 'ສະໝັກລົ້ມເຫຼວ';
        if (msg.contains('Username')) {
          msg = 'ຊື່ຜູ້ໃຊ້ນີ້ມີຢູ່ແລ້ວ';
        } else if (msg.contains('email')) {
          msg = 'ອີເມວນີ້ມີຢູ່ແລ້ວ';
        } else if (msg.contains('phone')) {
          msg = 'ເບີໂທນີ້ມີຢູ່ແລ້ວ';
        }
        Fluttertoast.showToast(
          msg: msg,
          backgroundColor: Colors.red[600],
          textColor: Colors.white,
          gravity: ToastGravity.TOP,
          fontSize: 16,
        );
      }
    } catch (e) {
      logger.e('Register Error: $e');
      Fluttertoast.showToast(
        msg: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີ',
        backgroundColor: Colors.red[600],
        textColor: Colors.white,
        gravity: ToastGravity.TOP,
        fontSize: 16,
      );
    } finally {
      isLoading.value = false; // Stop loading
    }
  }

  @override
  Widget build(BuildContext context) {
    final usernameController = useTextEditingController();
    final passwordController = useTextEditingController();
    final confirmPasswordController = useTextEditingController();
    final nameController = useTextEditingController();
    final emailController = useTextEditingController();
    final phoneController = useTextEditingController();
    final formKey = useMemoized(() => GlobalKey<FormState>());
    final isLoading = useState(false); // Added for loading state

    return Scaffold(
      backgroundColor: Colors.green[50],
      appBar: AppBar(
        backgroundColor: Colors.green[700],
        title: Text(
          'ສະໝັກບັນຊີ',
          style: GoogleFonts.mitr(fontSize: 22, color: Colors.white),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: isLoading.value
                ? null
                : () => registerUser(
                      context,
                      usernameController,
                      passwordController,
                      confirmPasswordController,
                      nameController,
                      emailController,
                      phoneController,
                      formKey,
                      isLoading,
                    ),
            icon: const Icon(Icons.save, color: Colors.white),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'ປ້ອນຂໍ້ມູນຜູ້ໃຊ້',
                style: GoogleFonts.mitr(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: Colors.green[900],
                ),
              ),
              const SizedBox(height: 20),
              buildInputField(usernameController, 'ຊື່ຜູ້ໃຊ້', Icons.person),
              const SizedBox(height: 16),
              buildInputField(passwordController, 'ລະຫັດຜ່ານ', Icons.lock, obscure: true),
              const SizedBox(height: 16),
              buildInputField(
                  confirmPasswordController, 'ຢືນຢັນລະຫັດຜ່ານ', Icons.lock_outline,
                  obscure: true),
              const SizedBox(height: 16),
              buildInputField(nameController, 'ຊື່', Icons.badge),
              const SizedBox(height: 16),
              buildInputField(emailController, 'ອີເມວ', Icons.email),
              const SizedBox(height: 16),
              buildInputField(phoneController, 'ເບີໂທ', Icons.phone),
              const SizedBox(height: 30),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: isLoading.value
                      ? null
                      : () => registerUser(
                            context,
                            usernameController,
                            passwordController,
                            confirmPasswordController,
                            nameController,
                            emailController,
                            phoneController,
                            formKey,
                            isLoading,
                          ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green[700],
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    textStyle: GoogleFonts.mitr(fontSize: 18),
                  ),
                  icon: isLoading.value
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : const Icon(Icons.check_circle_outline),
                  label: Text(isLoading.value ? 'ກຳລັງສະໝັກ...' : 'ສະໝັກບັນຊີ'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildInputField(
    TextEditingController controller,
    String label,
    IconData icon, {
    bool obscure = false,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.green[700]),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.green.shade700),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.green.shade700, width: 2),
        ),
      ),
      validator: (value) {
        value = value?.trim();
        if (value == null || value.isEmpty) {
          return 'ກະລຸນາປ້ອນ$label';
        }
        if (label == 'ລະຫັດຜ່ານ' && value.length < 6) {
          return 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວ';
        }
        if (label == 'ຢືນຢັນລະຫັດຜ່ານ' && value.length < 6) {
          return 'ຢືນຢັນລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວ';
        }
        if (label == 'ອີເມວ' && !RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
          return 'ກະລຸນາປ້ອນອີເມວທີ່ຖືກຕ້ອງ';
        }
        if (label == 'ເບີໂທ' && !RegExp(r'^\d{8,}$').hasMatch(value)) {
          return 'ກະລຸນາປ້ອນເບີໂທທີ່ຖືກຕ້ອງ (ຢ່າງໜ້ອຍ 8 ຕົວ)';
        }
        return null;
      },
    );
  }
}