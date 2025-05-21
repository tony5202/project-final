import 'dart:convert';
import 'package:app_ball/Modle/user_model.dart';
import 'package:app_ball/custom_snackbar.dart/custom_snackbar.dart';
import 'package:app_ball/ipapp.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class History extends StatefulWidget {
  const History({super.key, required this.user});
  final User user;

  @override
  State<History> createState() => _HistoryState();
}

class _HistoryState extends State<History> {
  List<dynamic> bookings = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchBookings();
  }

  Future<void> _fetchBookings() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
      bookings = [];
    });

    try {
      final response = await http.get(
        Uri.parse('${Ipapp.baseUrl}/api/bookings/user/${widget.user.id}'),
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          bookings = data['bookings'];
          isLoading = false;
        });
        CustomSnackBar.show(
          context,
          message: 'ດຶງປະຫວັດການຈອງສຳເລັດ',
          backgroundColor: Colors.green[700],
          icon: Icons.sports_soccer,
        );
      } else {
        final data = jsonDecode(response.body);
        throw Exception(data['msg'] ?? 'ບໍ່ສາມາດດຶງຂໍ້ມູນການຈອງໄດ້');
      }
    } catch (e) {
      setState(() {
        errorMessage = 'ເກີດຂໍ້ຜິດພາດ: ${e.toString()}';
        bookings = [];
        isLoading = false;
      });
      CustomSnackBar.show(
        context,
        message: errorMessage!,
        icon: Icons.warning,
        backgroundColor: Colors.red,
      );
    }
  }

  String _getTimeSlotDisplay(dynamic booking) {
    if (booking['booking_type'] == 'Event') {
      return 'ທັງມື້ (00:00–23:59)';
    }
    return booking['time_slot'] ?? 'N/A';
  }

  DateTime _getDisplayDate(dynamic booking) {
    final bookingDate = DateTime.parse(booking['booking_date']).toLocal();
    if (booking['booking_type'] == 'Event') {
      // Add one day for Event bookings
      return bookingDate.add(const Duration(days: 1));
    }
    return bookingDate;
  }
  DateTime _getDisplayDatekk(dynamic booking) {
    final bookingDate = DateTime.parse(booking['created_at']).toLocal();
  
      return bookingDate.add(const Duration(days: 0));
    
   
  }

  @override
  Widget build(BuildContext context) {
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
        child: RefreshIndicator(
          onRefresh: _fetchBookings,
          color: Colors.green[700],
          child: CustomScrollView(
            slivers: [
              SliverAppBar(
                title: const Text('ປະຫວັດການຈອງ', style: TextStyle(fontWeight: FontWeight.bold)),
                backgroundColor: Colors.green[700],
                elevation: 0,
                pinned: true,
                actions: [
                  IconButton(
                    icon: const Icon(Icons.refresh, color: Colors.white),
                    onPressed: _fetchBookings,
                    tooltip: 'ຣີເຟຣຊ',
                  ),
                ],
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: isLoading
                      ? Center(
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.green[700]!),
                          ),
                        )
                      : bookings.isEmpty
                          ? Center(
                              child: Container(
                                padding: const EdgeInsets.all(24.0),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(12.0),
                                  border: Border.all(color: Colors.green[700]!, width: 2.0),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.1),
                                      blurRadius: 8,
                                      spreadRadius: 2,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.sports_soccer,
                                      color: Colors.green[700],
                                      size: 48.0,
                                    ),
                                    const SizedBox(height: 16.0),
                                    Text(
                                      'ບໍ່ມີປະຫວັດການຈອງ',
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.green[700],
                                      ),
                                    ),
                                    const SizedBox(height: 8.0),
                                    Text(
                                      'ກະລຸນາຈອງສະໜາມກ່ອນເພື່ອເບິ່ງປະຫວັດ',
                                      style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.black87,
                                      ),
                                      textAlign: TextAlign.center,
                                    ),
                                  ],
                                ),
                              ),
                            )
                          : Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'ລາຍການການຈອງ',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                    fontFamily: 'Roboto',
                                  ),
                                ),
                                const SizedBox(height: 16),
                                ListView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: bookings.length,
                                  itemBuilder: (context, index) {
                                    final booking = bookings[index];
                                    final price = double.tryParse(booking['price'].toString()) ?? 0.0;
                                    final prePay = double.tryParse(booking['pre_pay'].toString()) ?? 0.0;

                                    return Card(
                                      color: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12.0),
                                        side: index == 0
                                            ? BorderSide(color: Colors.green[700]!, width: 2.0)
                                            : BorderSide.none,
                                      ),
                                      elevation: index == 0 ? 8.0 : 4.0,
                                      margin: const EdgeInsets.symmetric(vertical: 8.0),
                                      child: Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            // Booking ID
                                            Row(
                                              children: [
                                                Icon(Icons.confirmation_number, color: Colors.green[700]),
                                                const SizedBox(width: 12.0),
                                                Expanded(
                                                  child: Text(
                                                    'ລະຫັດການຈອງ: ${booking['id'] ?? 'N/A'}',
                                                    style: TextStyle(
                                                      color: _getStatusColor(booking['status']),
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 18,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            // Created At
                                            Row(
                                              children: [
                                                Icon(Icons.create, color: Colors.green[700]),
                                                const SizedBox(width: 12.0),
                                                Expanded(
                                                  child: Text(
                                                    'ມື້ທີ່ກົດຈອງເດີ່ນ : ${booking['created_at'] != null ? DateFormat('dd/MM/yyyy HH:mm', 'lo').format(_getDisplayDatekk(booking)) : 'N/A'}',
                                                    style: const TextStyle(color: Colors.black87),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            // User Name
                                            Row(
                                              children: [
                                                Icon(Icons.person, color: Colors.green[700]),
                                                const SizedBox(width: 12.0),
                                                Expanded(
                                                  child: Text(
                                                    'ຜູ້ຈອງ: ${booking['user_name'] ?? 'N/A'}',
                                                    style: const TextStyle(color: Colors.black87),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            // Stadium Detail
                                            Row(
                                              children: [
                                                Icon(Icons.stadium, color: Colors.green[700]),
                                                const SizedBox(width: 12.0),
                                                Expanded(
                                                  child: Text(
                                                    'ສະໜາມ: ${booking['stadium_dtail'] ?? booking['st_id'] ?? 'N/A'}',
                                                    style: const TextStyle(color: Colors.black87),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            // Booking Date
                                            Row(
                                              children: [
                                                Icon(Icons.calendar_today, color: Colors.green[700]),
                                                const SizedBox(width: 12.0),
                                                Text(
                                                  'ວັນທີ: ${DateFormat('dd/MM/yyyy', 'lo').format(_getDisplayDate(booking))}',
                                                  style: const TextStyle(color: Colors.black87),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            // Time Slot
                                            Row(
                                              children: [
                                                Icon(Icons.access_time, color: Colors.green[700]),
                                                const SizedBox(width: 12.0),
                                                Text(
                                                  'ເວລາ: ${_getTimeSlotDisplay(booking)}',
                                                  style: const TextStyle(color: Colors.black87),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            // Booking Type
                                            Row(
                                              children: [
                                                Icon(Icons.category, color: Colors.green[700]),
                                                const SizedBox(width: 12.0),
                                                Text(
                                                  'ປະເພດ: ${booking['booking_type'] == 'Football' ? 'ເຕະບານ' : 'ຈັດກິດຈະກຳ'}',
                                                  style: const TextStyle(color: Colors.black87),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            // Price
                                            Row(
                                              children: [
                                                Icon(Icons.attach_money, color: Colors.green[700]),
                                                const SizedBox(width: 12.0),
                                                Text(
                                                  'ລາຄາເດີ່ນ: ${NumberFormat("#,##0", "en_US").format(price)} ກີບ',
                                                  style: const TextStyle(color: Colors.black87),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            // Pre-Pay
                                            Row(
                                              children: [
                                                Icon(Icons.payment, color: Colors.green[700]),
                                                const SizedBox(width: 12.0),
                                                Text(
                                                  'ຈ່າຍຄ່າມັດຈຳ: ${NumberFormat("#,##0", "en_US").format(prePay)} ກີບ',
                                                  style: const TextStyle(color: Colors.black87),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            // Status
                                            Row(
                                              children: [
                                                Icon(Icons.tag, color: _getStatusColor(booking['status'])),
                                                const SizedBox(width: 12.0),
                                                Text(
                                                  'ສະຖານະ: ${_getStatusText(booking['status'])}',
                                                  style: TextStyle(
                                                    color: _getStatusColor(booking['status']),
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ],
                                            ),
                                            if (booking['slip_payment'] != null) ...[
                                              const SizedBox(height: 8),
                                              Row(
                                                children: [
                                                  Icon(Icons.image, color: Colors.green[700]),
                                                  const SizedBox(width: 12.0),
                                                  Expanded(
                                                    child: GestureDetector(
                                                      onTap: () {
                                                        _showSlipImage(booking['slip_payment']);
                                                      },
                                                      child: const Text(
                                                        'ເບິ່ງສະລິບການຊຳລະ',
                                                        style: TextStyle(
                                                          color: Colors.blue,
                                                          decoration: TextDecoration.underline,
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ],
                            ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'pending':
        return 'ກຳລັງດຳເນີນການ';
      case 'confirmed':
        return 'ອະນຸມັດ';
      case 'cancelled':
        return 'ປະຕິເສດການຈອງ';
      case 'completed':
        return 'ສຳເລັດ';
      default:
        return status;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.yellow[800]!;
      case 'confirmed':
        return Colors.green[700]!;
      case 'cancelled':
        return Colors.red[600]!;
      case 'completed':
        return Colors.blue[600]!;
      default:
        return Colors.black87;
    }
  }

  void _showSlipImage(String url) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        child: Container(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.network(
                url,
                fit: BoxFit.contain,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) {
                    return child;
                  }
                  return Center(
                    child: CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                          : null,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.green[700]!),
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) => const Icon(
                  Icons.error,
                  color: Colors.red,
                  size: 50,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green[700],
                ),
                child: const Text(
                  'ປິດ',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}