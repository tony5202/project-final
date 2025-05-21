import 'package:app_ball/Modle/user_model.dart';
import 'package:app_ball/custom_snackbar.dart/custom_snackbar.dart';
import 'package:app_ball/ipapp.dart';
import 'package:app_ball/page/reviewbookingscreen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';

class BookingScreen extends StatefulWidget {
  final User user;
  final dynamic stadium;

  const BookingScreen({super.key, required this.user, required this.stadium});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  DateTime? selectedDate;
  String? selectedTimeSlot;
  String bookingType = 'Football';
  bool isLoading = false;
  String? errorMessage;

  final priceFormat = NumberFormat("#,##0", "en_US");

  final List<Map<String, String>> timeSlots = [
    {'label': '08:00 - 10:00', 'start': '08:00', 'end': '10:00'},
    {'label': '10:00 - 12:00', 'start': '10:00', 'end': '12:00'},
    {'label': '12:00 - 14:00', 'start': '12:00', 'end': '14:00'},
    {'label': '14:00 - 16:00', 'start': '14:00', 'end': '16:00'},
    {'label': '16:00 - 18:00', 'start': '16:00', 'end': '18:00'},
    {'label': '18:00 - 20:00', 'start': '18:00', 'end': '20:00'},
  ];

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
      locale: const Locale('lo', 'LA'),
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: ColorScheme.light(
              primary: Colors.green[700]!,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: Colors.black87,
            ),
            dialogBackgroundColor: Colors.white,
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(foregroundColor: Colors.green[700]),
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null && mounted) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  bool _isValidSelection() {
    if (selectedDate == null) {
      return false;
    }
    if (bookingType == 'Football' && selectedTimeSlot == null) {
      return false;
    }

    final now = DateTime.now();
    DateTime startDateTime;
    DateTime endDateTime;

    if (bookingType == 'Event') {
      startDateTime = DateTime(selectedDate!.year, selectedDate!.month, selectedDate!.day, 0, 0);
      endDateTime = DateTime(selectedDate!.year, selectedDate!.month, selectedDate!.day, 23, 59);
    } else {
      final selectedSlot = timeSlots.firstWhere(
        (slot) => slot['label'] == selectedTimeSlot,
        orElse: () => throw Exception('ຊ່ວງເວລາບໍ່ຖືກຕ້ອງ'),
      );
      final startHour = int.parse(selectedSlot['start']!.split(':')[0]);
      final startMinute = int.parse(selectedSlot['start']!.split(':')[1]);
      final endHour = int.parse(selectedSlot['end']!.split(':')[0]);
      final endMinute = int.parse(selectedSlot['end']!.split(':')[1]);
      startDateTime = DateTime(
        selectedDate!.year,
        selectedDate!.month,
        selectedDate!.day,
        startHour,
        startMinute,
      );
      endDateTime = DateTime(
        selectedDate!.year,
        selectedDate!.month,
        selectedDate!.day,
        endHour,
        endMinute,
      );
    }

    // Check if the start time is in the future
    if (!startDateTime.isAfter(now)) {
      setState(() {
        errorMessage = 'ບໍ່ສາມາດຈອງເວລາທີ່ຜ່ານມາແລ້ວໄດ້';
      });
      WidgetsBinding.instance.addPostFrameCallback((_) {
        CustomSnackBar.show(
          context,
          message: errorMessage!,
          icon: Icons.warning,
          backgroundColor: Colors.red,
        );
      });
      return false;
    }

    return endDateTime.isAfter(startDateTime);
  }

  void _resetSelection() {
    setState(() {
      selectedDate = null;
      selectedTimeSlot = null;
      bookingType = 'Football';
      errorMessage = null;
    });
  }

  Future<void> _checkAvailability() async {
    if (!_isValidSelection()) {
      setState(() {
        errorMessage = 'ກະລຸນາເລືອກວັນແລະເວລາໃຫ້ຖືກຕ້ອງ';
      });
      CustomSnackBar.show(
        context,
        message: errorMessage!,
        icon: Icons.warning,
      );
      return;
    }

    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      DateTime startDateTime;
      DateTime endDateTime;

      if (bookingType == 'Event') {
        startDateTime = DateTime(selectedDate!.year, selectedDate!.month, selectedDate!.day, 0, 0);
        endDateTime = DateTime(selectedDate!.year, selectedDate!.month, selectedDate!.day, 23, 59);
      } else {
        final selectedSlot = timeSlots.firstWhere((slot) => slot['label'] == selectedTimeSlot!);
        final startHour = int.parse(selectedSlot['start']!.split(':')[0]);
        final startMinute = int.parse(selectedSlot['start']!.split(':')[1]);
        final endHour = int.parse(selectedSlot['end']!.split(':')[0]);
        final endMinute = int.parse(selectedSlot['end']!.split(':')[1]);
        startDateTime = DateTime(
          selectedDate!.year,
          selectedDate!.month,
          selectedDate!.day,
          startHour,
          startMinute,
        );
        endDateTime = DateTime(
          selectedDate!.year,
          selectedDate!.month,
          selectedDate!.day,
          endHour,
          endMinute,
        );
      }

      final response = await http.get(
        Uri.parse(
          '${Ipapp.baseUrl}/api/stadium/${widget.stadium['st_id']}/availability'
          '?start_time=${startDateTime.toIso8601String()}'
          '&end_time=${endDateTime.toIso8601String()}'
          '&booking_type=$bookingType',
        ),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['available'] == true) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ReviewBookingScreen(
                user: widget.user,
                stadium: widget.stadium,
                startTime: startDateTime,
                endTime: endDateTime,
                bookingType: bookingType,
              ),
            ),
          );
        } else {
          setState(() {
            errorMessage = data['msg'] ?? 'ຊ່ວງເວລານີ້ແມ່ນບໍ່ວ່າງ';
          });
          CustomSnackBar.show(
            context,
            message: errorMessage!,
            icon: Icons.warning,
          );
        }
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['msg'] ?? 'ບໍ່ສາມາດກວດສອບຄວາມວ່າງໄດ້');
      }
    } catch (e) {
      setState(() {
        errorMessage = 'ເກີດຂໍ້ຜິດພາດ: ${e.toString()}';
      });
      CustomSnackBar.show(
        context,
        message: errorMessage!,
        icon: Icons.warning,
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green[300]!, Colors.green[300]!],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              title: const Text('ຈອງເດີ່ນ', style: TextStyle(fontWeight: FontWeight.bold)),
              backgroundColor: Colors.green[700],
              elevation: 0,
              pinned: true,
              actions: [
                IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: _resetSelection,
                  tooltip: 'ຣີເຊັດ',
                ),
              ],
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Card(
                      color: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                      elevation: 4.0,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          children: [
                            Icon(Icons.sports_soccer, color: Colors.green[700], size: 28.0),
                            const SizedBox(width: 12.0),
                            Expanded(
                              child: Text(
                                widget.stadium['dtail'] ?? 'ບໍ່ມີຊື່',
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                  fontFamily: 'Roboto',
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'ປະເພດການຈອງ:',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    Card(
                      color: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                      elevation: 4.0,
                      child: Column(
                        children: [
                          RadioListTile<String>(
                            title: Text(
                              'ເຕະບານ (${priceFormat.format(double.tryParse(widget.stadium['price']?.toString() ?? '0') ?? 0)} ກີບ)',
                              style: const TextStyle(color: Colors.black87),
                            ),
                            value: 'Football',
                            groupValue: bookingType,
                            activeColor: Colors.green[700],
                            secondary: Icon(Icons.sports_soccer, color: Colors.green[700]),
                            onChanged: (value) => setState(() => bookingType = value!),
                          ),
                          RadioListTile<String>(
                            title: Text(
                              'ຈັດກິດຈະກຳ (${priceFormat.format(double.tryParse(widget.stadium['price2']?.toString() ?? '0') ?? 0)} ກີບ - ເຫມົາທັງມື້)',
                              style: const TextStyle(color: Colors.black87),
                            ),
                            value: 'Event',
                            groupValue: bookingType,
                            activeColor: Colors.green[700],
                            secondary: Icon(Icons.event, color: Colors.green[700]),
                            onChanged: (value) => setState(() {
                              bookingType = value!;
                              selectedTimeSlot = null;
                            }),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Card(
                      color: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                      elevation: 4.0,
                      child: ListTile(
                        leading: Icon(Icons.calendar_today, color: Colors.green[700]),
                        title: Text(
                          selectedDate == null
                              ? 'ເລືອກວັນ'
                              : DateFormat('dd/MM/yyyy', 'lo').format(selectedDate!),
                          style: const TextStyle(fontSize: 16, color: Colors.black87),
                        ),
                        onTap: () => _selectDate(context),
                      ),
                    ),
                    const SizedBox(height: 20),
                    if (bookingType == 'Football') ...[
                      const Text(
                        'ຊ່ວງເວລາ:',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      Card(
                        color: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                        elevation: 4.0,
                        child: Column(
                          children: timeSlots
                              .map((slot) => RadioListTile<String>(
                                    title: Text(slot['label']!, style: const TextStyle(color: Colors.black87)),
                                    value: slot['label']!,
                                    groupValue: selectedTimeSlot,
                                    activeColor: Colors.green[700],
                                    secondary: Icon(Icons.access_time, color: Colors.green[700]),
                                    onChanged: (value) => setState(() => selectedTimeSlot = value!),
                                  ))
                              .toList(),
                        ),
                      ),
                    ] else ...[
                      Card(
                        color: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                        elevation: 4.0,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            children: [
                              Icon(Icons.event, color: Colors.green[700]),
                              const SizedBox(width: 12.0),
                              const Text(
                                'ຊ່ວງເວລາ: ທັງມື້ (8:00 - 20:00)',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                    const SizedBox(height: 20),
                    Center(
                      child: isLoading
                          ? CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.green[700]!),
                            )
                          : AnimatedScaleButton(
                              onPressed: _isValidSelection() ? _checkAvailability : null,
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [Colors.green[500]!, Colors.green[700]!],
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
                                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.check_circle, color: Colors.white, size: 20.0),
                                    const SizedBox(width: 8.0),
                                    const Text(
                                      'ກວດເຊັກຄວາມວ່າງ',
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

// Custom button with scale animation
class AnimatedScaleButton extends StatefulWidget {
  final VoidCallback? onPressed;
  final Widget child;

  const AnimatedScaleButton({super.key, required this.onPressed, required this.child});

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
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: widget.child,
      ),
    );
  }}