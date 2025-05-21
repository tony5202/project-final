import 'package:app_ball/Modle/user_model.dart';
import 'package:app_ball/ipapp.dart';
import 'package:app_ball/page/bookingscreen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';


class Homepage extends StatefulWidget {
  final User user;

  const Homepage({super.key, required this.user});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  late List<dynamic> stadiums;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchStadiums();
  }

  Future<void> _fetchStadiums() async {
    try {
      setState(() {
        isLoading = true;
      });

      final response = await http.get(
        Uri.parse('${Ipapp.baseUrl}/api/stadium'),
      );

      if (response.statusCode == 200) {
        setState(() {
          stadiums = jsonDecode(response.body);
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load stadiums');
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      _showErrorDialog(e.toString());
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final priceFormat = NumberFormat("#,##0", "en_US");

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.user.username} ຈອງເດີ່ນ'),
        backgroundColor: Colors.green[800],
      ),
      body: RefreshIndicator(
        onRefresh: _fetchStadiums,
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView.builder(
                itemCount: stadiums.length,
                itemBuilder: (context, index) {
                  final stadium = stadiums[index];
                  return Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Card(
                      elevation: 5,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                      color: Colors.white,
                      child: InkWell(
                        // Make the card tappable
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => BookingScreen(
                                user: widget.user,
                                stadium: stadium,
                              ),
                            ),
                          );
                        },
                        child: Padding(
                          padding: const EdgeInsets.all(10.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(15),
                                child: Image.network(
                                  stadium['image'] ?? '',
                                  width: double.infinity,
                                  height: 180,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) =>
                                      const Icon(Icons.broken_image, size: 180),
                                ),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                stadium['dtail'] ?? 'No Name',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green[700],
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text.rich(
                                TextSpan(
                                  text: 'ລາຄາເຕະບານ : ',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey,
                                  ),
                                  children: <TextSpan>[
                                    TextSpan(
                                      text:
                                          '${priceFormat.format(double.tryParse(stadium['price']?.toString() ?? '0') ?? 0)} ',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.green[800],
                                      ),
                                    ),
                                    const TextSpan(
                                      text: 'ກີບ',
                                      style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text.rich(
                                TextSpan(
                                  text: 'ລາຄາຈັດກິດຈະກຳ : ',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey,
                                  ),
                                  children: <TextSpan>[
                                    TextSpan(
                                      text:
                                          '${priceFormat.format(double.tryParse(stadium['price2']?.toString() ?? '0') ?? 0)} ',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.green[800],
                                      ),
                                    ),
                                    const TextSpan(
                                      text: 'ກີບ',
                                      style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _fetchStadiums,
        child: const Icon(Icons.refresh),
        backgroundColor: Colors.green[800],
      ),
    );
  }
}