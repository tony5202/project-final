import 'dart:convert';
import 'dart:io';
import 'package:app_ball/Modle/user_model.dart';
import 'package:app_ball/Tab%20bar/history.dart';
import 'package:app_ball/custom_snackbar.dart/custom_snackbar.dart';
import 'package:app_ball/ipapp.dart';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:image_picker/image_picker.dart';

class ReviewBookingScreen extends StatefulWidget {
  final User user;
  final dynamic stadium;
  final DateTime startTime;
  final DateTime endTime;
  final String bookingType;

  const ReviewBookingScreen({
    super.key,
    required this.user,
    required this.stadium,
    required this.startTime,
    required this.endTime,
    required this.bookingType,
  });

  @override
  State<ReviewBookingScreen> createState() => _ReviewBookingScreenState();
}

class _ReviewBookingScreenState extends State<ReviewBookingScreen> {
  File? slipFile;
  bool isLoading = false;
  String? errorMessage;

  Future<void> _pickSlipImage() async {
    try {
      final pickedFile = await ImagePicker().pickImage(
        source: ImageSource.gallery,
      );
      if (pickedFile != null && mounted) {
        setState(() {
          slipFile = File(pickedFile.path);
          errorMessage = null;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການເລືອກຮູບ: $e';
      });
      CustomSnackBar.show(context, message: errorMessage!, icon: Icons.warning);
    }
  }

  void _removeSlipImage() {
    setState(() {
      slipFile = null;
      errorMessage = null;
    });
  }

  Future<void> _confirmBooking() async {
    if (slipFile == null) {
      setState(() {
        errorMessage = 'ກະລຸນາອັບໂຫຼດສະລິບການຊຳລະເງິນ';
      });
      CustomSnackBar.show(context, message: errorMessage!, icon: Icons.warning);
      return;
    }

    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final price = widget.bookingType == 'Football'
          ? double.tryParse(widget.stadium['price']?.toString() ?? '0') ?? 0
          : double.tryParse(widget.stadium['price2']?.toString() ?? '0') ?? 0;
      final prePay = price * 0.3;

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${Ipapp.baseUrl}/api/booking'),
      );
      request.fields['user_id'] = widget.user.id.toString();
      request.fields['st_id'] = widget.stadium['st_id'].toString();
      request.fields['start_time'] = widget.startTime.toIso8601String();
      request.fields['end_time'] = widget.endTime.toIso8601String();
      request.fields['price'] = price.toString();
      request.fields['pre_pay'] = prePay.toString();
      request.fields['status'] = 'pending';
      request.fields['booking_type'] = widget.bookingType;

      request.files.add(
        await http.MultipartFile.fromPath('image', slipFile!.path),
      );

      final response = await request.send();
      final responseBody = await response.stream.bytesToString();
      final responseData = jsonDecode(responseBody);

      if (response.statusCode == 201) {
        CustomSnackBar.show(
          context,
          message: 'ຈອງສະໜາມສຳເລັດ',
          backgroundColor: Colors.green[700],
          icon: Icons.sports_soccer,
        );
        // Navigate to History screen
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => History(user: widget.user),
          ),
        );
      } else {
        throw Exception(responseData['msg'] ?? 'ບໍ່ສາມາດຈອງໄດ້');
      }
    } catch (e) {
      setState(() {
        errorMessage = 'ເກີດຂໍ້ຜິດພາດ: ${e.toString()}';
      });
      CustomSnackBar.show(context, message: errorMessage!, icon: Icons.warning);
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final price = widget.bookingType == 'Football'
        ? double.tryParse(widget.stadium['price']?.toString() ?? '0') ?? 0
        : double.tryParse(widget.stadium['price2']?.toString() ?? '0') ?? 0;
    final prePay = price * 0.3;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green[100]!, Colors.green[300]!],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              title: const Text(
                'ຢືນຢັນການຈອງ',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              backgroundColor: Colors.green[700],
              elevation: 0,
              pinned: true,
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 16.0,
                ),
                child: Container(
                  height: screenWidth * 0.9,
                  width: screenWidth * 0.6,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    image: const DecorationImage(
                      image: AssetImage('assets/q1.JPG'),
                      fit: BoxFit.cover,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.15),
                        blurRadius: 10,
                        spreadRadius: 2,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'ລາຍລະອຽດການຈອງ',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                        fontFamily: 'Roboto',
                      ),
                    ),
                    const SizedBox(height: 20),
                    Card(
                      color: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      elevation: 4.0,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.stadium, color: Colors.green[700]),
                                const SizedBox(width: 12.0),
                                Expanded(
                                  child: Text(
                                    'ສະໜາມ: ${widget.stadium['dtail'] ?? 'ບໍ່ມີຊື່'}',
                                    style: const TextStyle(
                                      color: Colors.black87,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(
                                  Icons.calendar_today,
                                  color: Colors.green[700],
                                ),
                                const SizedBox(width: 12.0),
                                Text(
                                  'ວັນທີ: ${DateFormat('dd/MM/yyyy', 'lo').format(widget.startTime)}',
                                  style: const TextStyle(color: Colors.black87),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(
                                  Icons.access_time,
                                  color: Colors.green[700],
                                ),
                                const SizedBox(width: 12.0),
                                Text(
                                  widget.bookingType == 'Event'
                                      ? 'ເວລາ: ທັງມື້ (8:00 - 20:00)'
                                      : 'ເວລາ: ${TimeOfDay.fromDateTime(widget.startTime).format(context)} - ${TimeOfDay.fromDateTime(widget.endTime).format(context)}',
                                  style: const TextStyle(color: Colors.black87),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(Icons.category, color: Colors.green[700]),
                                const SizedBox(width: 12.0),
                                Text(
                                  'ປະເພດ: ${widget.bookingType == 'Football' ? 'ເຕະບາ' : 'ອີເວັນ'}',
                                  style: const TextStyle(color: Colors.black87),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(
                                  Icons.attach_money,
                                  color: Colors.green[700],
                                ),
                                const SizedBox(width: 12.0),
                                Text(
                                  'ລາຄາ: ${NumberFormat("#,##0", "en_US").format(price)} ກີບ',
                                  style: const TextStyle(color: Colors.black87),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(Icons.payment, color: Colors.green[700]),
                                const SizedBox(width: 12.0),
                                Text(
                                  'ຄ່າມັດຈຳ (30%): ${NumberFormat("#,##0", "en_US").format(prePay)} ກີບ',
                                  style: const TextStyle(color: Colors.black87),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    AnimatedScaleButton(
                      onPressed: _pickSlipImage,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.yellow[600]!, Colors.yellow[800]!],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(30.0),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 8.0,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 12,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.upload_file, color: Colors.white),
                            const SizedBox(width: 8.0),
                            const Text(
                              'ອັບໂຫຼດສະລິບການຊຳລະເງິນ',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontFamily: 'Roboto',
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    if (slipFile != null) ...[
                      const SizedBox(height: 20),
                      Center(
                        child: Stack(
                          alignment: Alignment.topRight,
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12.0),
                                border: Border.all(
                                  color: Colors.green[700]!,
                                  width: 2.0,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.2),
                                    blurRadius: 8.0,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              constraints: const BoxConstraints(
                                maxWidth: 200,
                                maxHeight: 200,
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(10.0),
                                child: Image.file(
                                  slipFile!,
                                  fit: BoxFit.cover,
                                  errorBuilder:
                                      (context, error, stackTrace) =>
                                          const Center(
                                            child: Icon(
                                              Icons.error,
                                              color: Colors.red,
                                              size: 50,
                                            ),
                                          ),
                                ),
                              ),
                            ),
                            Positioned(
                              top: -10,
                              right: -10,
                              child: IconButton(
                                icon: Icon(
                                  Icons.cancel,
                                  color: Colors.red[600],
                                  size: 30,
                                ),
                                onPressed: _removeSlipImage,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          'ສະລິບ: ${slipFile!.path.split('/').last}',
                          style: const TextStyle(color: Colors.black87),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],
                    const SizedBox(height: 20),
                    Center(
                      child: isLoading
                          ? CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Colors.green[700]!,
                              ),
                            )
                          : AnimatedScaleButton(
                              onPressed: _confirmBooking,
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      Colors.green[500]!,
                                      Colors.green[700]!,
                                    ],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                  borderRadius: BorderRadius.circular(30.0),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.2),
                                      blurRadius: 8.0,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 40,
                                  vertical: 15,
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.check_circle,
                                      color: Colors.white,
                                      size: 20.0,
                                    ),
                                    const SizedBox(width: 8.0),
                                    const Text(
                                      'ຢືນຢັນການຈອງ',
                                      style: TextStyle(
                                        fontSize: 18,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontFamily: 'Roboto',
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AnimatedScaleButton extends StatefulWidget {
  final VoidCallback? onPressed;
  final Widget child;

  const AnimatedScaleButton({
    super.key,
    required this.onPressed,
    required this.child,
  });

  @override
  __AnimatedScaleButtonState createState() => __AnimatedScaleButtonState();
}

class __AnimatedScaleButtonState extends State<AnimatedScaleButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        if (widget.onPressed != null) _controller.forward();
      },
      onTapUp: (_) {
        _controller.reverse();
        if (widget.onPressed != null) widget.onPressed!();
      },
      onTapCancel: () {
        _controller.reverse();
      },
      child: ScaleTransition(scale: _scaleAnimation, child: widget.child),
    );
  }}