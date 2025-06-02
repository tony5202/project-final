import 'dart:async';
import 'package:app_ball/Modle/user_model.dart';
import 'package:app_ball/ipapp.dart';
import 'package:app_ball/page/bookingscreen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';

class Homepage extends StatefulWidget {
  final User user;

  const Homepage({super.key, required this.user});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  List<dynamic> stadiums = [];
  bool isLoading = true;
  String? errorMessage;

  Timer? _refreshTimer; // <-- Timer สำหรับรีเฟรชทุก 1 วิ

  @override
  void initState() {
    super.initState();
    _fetchStadiums(); // ดึงครั้งแรก

    // // ดึงข้อมูลซ้ำทุก ๆ 1 วินาที (real‑time)
    // _refreshTimer = Timer.periodic(const Duration(seconds: 5), (_) {
    //   _fetchStadiums(showLoading: false); // ไม่โชว์ progress ทุกครั้ง
    // });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel(); // ยกเลิก Timer เมื่อหน้าโดน dispose
    super.dispose();
  }

  Future<void> _fetchStadiums({bool showLoading = true}) async {
    try {
      if (showLoading) {
        setState(() {
          isLoading = true;
          errorMessage = null;
        });
      }

      final response = await http.get(
        Uri.parse('${Ipapp.baseUrl}/api/stadium'),
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ${widget.user.token}',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          stadiums =
              data.where((stadium) => stadium['status'] == 'active').toList();
          isLoading = false;
        });
      } else {
        throw Exception('ບໍ່ສາມາດດຶງຂໍ້ມູນເດີ່ນໄດ້: ${response.statusCode}');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
        errorMessage = e.toString();
      });
      _showErrorDialog('ບໍ່ສາມາດດຶງຂໍ້ມູນເດີ່ນໄດ້: $e');
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('ຜິດພາດ'),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('ຕົກລົງ'),
              ),
            ],
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final priceFormat = NumberFormat('#,##0', 'en_US');

    return Scaffold(
      // สำหรับฟอนต์สวยงาม
      appBar: AppBar(
        // ปรับความสูงของ AppBar เพื่อความลงตัว
        toolbarHeight: 70,
        // เพิ่มเงาให้ AppBar ดูมีมิติ
        elevation: 6,
        // ใช้ Gradient และ BoxDecoration สำหรับพื้นหลัง
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.green[800]!, Colors.green[500]!],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                blurRadius: 6,
                offset: const Offset(0, 3),
              ),
            ],
          ),
        ),
        // Title ปรับแต่งด้วย Google Fonts และเพิ่มโลโก้
        title: Row(
          mainAxisSize: MainAxisSize.min, // ทำให้ Row ใช้พื้นที่เท่าที่จำเป็น
          children: [
            // โลโก้เล็ก ๆ (สมมติใช้ asset)
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.9),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons
                    .sports_soccer, // ไอคอนลูกฟุตบอลแทนโลโก้ (เปลี่ยนได้ถ้ามี asset)
                color: Colors.green,
                size: 24,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              '${widget.user.username} ຈອງເດີ່ນ',
              style: GoogleFonts.prompt(
                // ฟอนต์ Prompt เหมาะกับภาษาลาว
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: Colors.white,
                letterSpacing: 0.5,
                shadows: [
                  Shadow(
                    color: Colors.black.withOpacity(0.3),
                    offset: const Offset(1, 1),
                    blurRadius: 2,
                  ),
                ],
              ),
            ),
          ],
        ),
        // จัดตำแหน่ง title ตรงกลาง
        centerTitle: true,
        // ปรับแต่ง actions
        actions: [
          // ปุ่มรีเฟรชพร้อม animation
          IconButton(
            icon: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              transitionBuilder:
                  (child, animation) =>
                      RotationTransition(turns: animation, child: child),
              child: const Icon(
                Icons.refresh,
                key: ValueKey('refresh'),
                color: Colors.white,
                size: 26,
              ),
            ),
            onPressed: () {
              _fetchStadiums();
              // Optional: Feedback ด้วย SnackBar
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'ກຳລັງໂຫລດຂໍ້ມູນຄືນໃໝ່...',
                    style: GoogleFonts.prompt(),
                  ),
                  backgroundColor: Colors.green[600],
                  duration: const Duration(seconds: 2),
                ),
              );
            },
            tooltip: 'ໂຫຼດຂໍ້ມູນຄືນໃໝ່',
          ),
          const SizedBox(width: 8), // ระยะขอบขวา
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetchStadiums,
        child:
            isLoading
                ? const Center(child: CircularProgressIndicator())
                : errorMessage != null
                ? _buildErrorState()
                : stadiums.isEmpty
                ? _buildEmptyState()
                : _buildStadiumList(priceFormat),
      ),
    );
  }

  // แยก widget ย่อย ๆ เพื่อให้อ่านง่าย
  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            errorMessage ?? '',
            style: TextStyle(fontSize: 18, color: Colors.red[600]),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _fetchStadiums,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green[800],
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            ),
            child: const Text(
              'ລອງໃໝ່ອີກຄັ້ງ',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Text(
        'ບໍ່ມີເດີ່ນທີ່ພ້ອມໃຊ້ງານ',
        style: TextStyle(fontSize: 18, color: Colors.grey[600]),
      ),
    );
  }

  Widget _buildStadiumList(NumberFormat priceFormat) {
    return ListView.builder(
      padding: const EdgeInsets.all(8.0),
      itemCount: stadiums.length,
      itemBuilder: (context, index) {
        final stadium = stadiums[index];
        return Card(
          elevation: 5,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          color: Colors.white,
          child: InkWell(
            onTap: () {
              if (stadium['status'] == 'active') {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder:
                        (context) =>
                            BookingScreen(user: widget.user, stadium: stadium),
                  ),
                );
              } else {
                _showErrorDialog(
                  'ສະໜາມນີ້ບໍ່ສາມາດຈອງໄດ້ ເນື່ອງຈາກຖືກປິດໃຊ້ງານ',
                );
              }
            },
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildStadiumImage(stadium),
                  const SizedBox(height: 10),
                  Text(
                    stadium['dtail'] ?? 'ບໍ່ມີຊື່',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.green[700],
                    ),
                  ),
                  const SizedBox(height: 5),
                  _buildPriceRow('ລາຄາເຕະບານ: ', stadium['price'], priceFormat),
                  const SizedBox(height: 5),
                  _buildPriceRow(
                    'ລາຄາຈັດກິດຈະກຳ: ',
                    stadium['price2'],
                    priceFormat,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildStadiumImage(dynamic stadium) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(15),
      child: Image.network(
        stadium['image'] ?? '',
        width: double.infinity,
        height: 180,
        fit: BoxFit.cover,
        errorBuilder:
            (context, error, stackTrace) => Container(
              height: 180,
              color: Colors.grey[300],
              child: const Icon(
                Icons.broken_image,
                size: 50,
                color: Colors.grey,
              ),
            ),
      ),
    );
  }

  Widget _buildPriceRow(String label, dynamic price, NumberFormat priceFormat) {
    return Text.rich(
      TextSpan(
        text: label,
        style: const TextStyle(fontSize: 16, color: Colors.grey),
        children: <TextSpan>[
          TextSpan(
            text:
                '${priceFormat.format(double.tryParse(price?.toString() ?? '0') ?? 0)} ',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.green[800],
            ),
          ),
          const TextSpan(
            text: 'ກີບ',
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
