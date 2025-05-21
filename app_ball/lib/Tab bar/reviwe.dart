import 'package:app_ball/ipapp.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:logger/logger.dart';
import 'package:intl/intl.dart'; // Import intl package
import 'package:app_ball/Modle/user_model.dart';

class Review extends StatefulWidget {
  final User user;
  const Review({Key? key, required this.user}) : super(key: key);

  @override
  State<Review> createState() => _ReviewState();
}

class _ReviewState extends State<Review> {
  final TextEditingController _reviewController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final Logger _logger = Logger();
  double _star = 5.0;
  bool _isLoading = false;
  List<dynamic> _reviews = [];
  int _page = 1;
  bool _hasMore = true;
  final int _maxRetries = 3;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchReviews();
    });

    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
              _scrollController.position.maxScrollExtent * 0.9 &&
          !_isLoading &&
          _hasMore) {
        _fetchReviews(loadMore: true);
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _reviewController.dispose();
    super.dispose();
  }

  // Helper function to format created_at timestamp
  String _formatDateTime(String createdAt) {
    try {
      final dateTime = DateTime.parse(createdAt).toLocal(); // Convert to local time
      final formatter = DateFormat('dd MMMM yyyy, HH:mm', 'lo_LA'); // Lao format
      return formatter.format(dateTime);
    } catch (e) {
      _logger.e('Error parsing created_at: $createdAt, Error: $e');
      return createdAt; // Fallback to raw string if parsing fails
    }
  }

  Future<void> _fetchReviews({bool loadMore = false, int retryCount = 0}) async {
    if (_isLoading || (!_hasMore && loadMore)) return;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        setState(() => _isLoading = true);
      }
    });

    final url = Uri.parse('${Ipapp.baseUrl}/api/review?page=$_page');
    _logger.i('Fetching reviews: URL=$url, Page=$_page, LoadMore=$loadMore, Retry=$retryCount');

    try {
      final response = await http.get(
        url,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      ).timeout(const Duration(seconds: 10));

      _logger.i('Fetch Reviews Response: ${response.statusCode}, Body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final json = jsonDecode(response.body);
          if (json is Map<String, dynamic> &&
              json.containsKey('reviews') &&
              json.containsKey('page') &&
              json.containsKey('totalPages')) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (mounted) {
                setState(() {
                  if (loadMore) {
                    _reviews.addAll(json['reviews']);
                  } else {
                    _reviews = json['reviews'];
                  }
                  _hasMore = json['page'] < json['totalPages'];
                  if (_hasMore) _page++;
                });
              }
            });
            // Log first 3 reviews to confirm sorting
            final firstThreeReviews = json['reviews'].take(3).map((r) => {
                  'id': r['id'],
                  'created_at': r['created_at'],
                  'username': r['username']
                }).toList();
            _logger.i('First 3 reviews: ${jsonEncode(firstThreeReviews)}');
          } else {
            _logger.e('Invalid JSON structure: Missing required keys');
            _showToast('ຂໍ້ມູນບໍ່ຖືກຕ້ອງ: ຮູບແບບຂໍ້ມູນຜິດພາດ', Colors.red[600]!);
          }
        } catch (e) {
          _logger.e('Error parsing JSON: $e');
          _showToast('ຂໍ້ຜິດພາດໃນການອ່ານຂໍ້ມູນ: $e', Colors.red[600]!);
        }
      } else {
        _showToast('ບໍ່ສາມາດໂຫຼດຣີີວິວໄດ້: Status ${response.statusCode}', Colors.red[600]!);
      }
    } catch (e) {
      _logger.e('Fetch Reviews Error: $e');
      if (retryCount < _maxRetries) {
        _logger.i('Retrying fetch reviews: Attempt ${retryCount + 1}');
        await Future.delayed(const Duration(seconds: 1));
        return _fetchReviews(loadMore: loadMore, retryCount: retryCount + 1);
      }
      _showToast('ຂໍ້ຜິດພາດເຄືອຂ່າຍ: $e', Colors.red[600]!);
    } finally {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      });
    }
  }

  Future<void> submitReview() async {
    final reviewText = _reviewController.text.trim();
    if (reviewText.isEmpty) {
      _showToast('ກະລຸນາປ້ອນຣີີວິວ', Colors.red[600]!);
      return;
    }

    if (_star < 1) {
      _showToast('ກະລຸນາໃຫ້ຄະແນນຢ່າງໜ້ອຍ 1 ດາວ', Colors.red[600]!);
      return;
    }

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        setState(() => _isLoading = true);
      }
    });

    final url = Uri.parse('${Ipapp.baseUrl}/api/review');
    final requestBody = {
      'user_id': widget.user.id,
      'star': _star.round(),
      'review': reviewText,
    };
    _logger.i('Submitting review: URL=$url, Body=$requestBody');

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      ).timeout(const Duration(seconds: 10));

      _logger.i('Submit Review Response: ${response.statusCode}, Body: ${response.body}');

      if (response.statusCode == 201) {
        _showToast(
          'ຣີີວິວຂອງທ່ານຖືກສົ່ງສຳເລັດ 🎉',
          Colors.green[600]!,
        );
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            setState(() {
              _reviewController.clear();
              _star = 0.0;
              _page = 1;
              _hasMore = true;
              _reviews = [];
            });
            Future.delayed(const Duration(milliseconds: 500), () {
              _fetchReviews();
            });
          }
        });
      } else {
        String msg = 'ເກີດຂໍ້ຜິດພາດ';
        try {
          final json = jsonDecode(response.body);
          msg = json['msg'] ?? 'Status ${response.statusCode}';
        } catch (e) {
          _logger.e('Error parsing error response: $e');
        }
        _showToast('ສົ່ງຣີີວິວລົ້ມເຫຼວ: $msg', Colors.red[600]!);
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            setState(() {
              _page = 1;
              _hasMore = true;
              _reviews = [];
            });
            _fetchReviews();
          }
        });
      }
    } catch (e) {
      _logger.e('Submit Review Error: $e');
      _showToast('ຂໍ້ຜິດພາດເຄືອຂ່າຍ: $e', Colors.red[600]!);
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          setState(() {
            _page = 1;
            _hasMore = true;
            _reviews = [];
          });
          _fetchReviews();
        }
      });
    } finally {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      });
    }
  }

  void _showToast(String message, Color backgroundColor) {
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_LONG,
      gravity: ToastGravity.TOP,
      backgroundColor: backgroundColor,
      textColor: Colors.white,
      fontSize: 16.0,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green[100]!, Colors.green[300]!],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: CustomScrollView(
          controller: _scrollController,
          slivers: [
            SliverAppBar(
              title: Text(
                'ຣີີວິວໂດຍ @${widget.user.username}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              backgroundColor: Colors.green[700],
              pinned: true,
              elevation: 4,
            ),
            SliverToBoxAdapter(
              child: RefreshIndicator(
                onRefresh: () async {
                  _page = 1;
                  _hasMore = true;
                  _reviews = [];
                  await _fetchReviews();
                },
                color: Colors.green[700],
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
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
                                  Icon(Icons.star_border, color: Colors.amber),
                                  SizedBox(width: 8),
                                  Text(
                                    'ໃຫ້ຄະແນນແອັບ',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              RatingBar.builder(
                                initialRating: _star,
                                minRating: 1,
                                direction: Axis.horizontal,
                                allowHalfRating: false,
                                itemCount: 5,
                                itemPadding:
                                    const EdgeInsets.symmetric(horizontal: 4),
                                itemBuilder: (context, _) => const Icon(
                                  Icons.star,
                                  color: Colors.amber,
                                ),
                                onRatingUpdate: (rating) {
                                  setState(() => _star = rating);
                                },
                              ),
                              const SizedBox(height: 20),
                              TextField(
                                controller: _reviewController,
                                decoration: InputDecoration(
                                  labelText: 'ພິມຣີີວິວຂອງທ່ານ',
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  filled: true,
                                  fillColor: Colors.white,
                                  prefixIcon:
                                      const Icon(Icons.comment, color: Colors.grey),
                                ),
                                maxLines: 5,
                              ),
                              const SizedBox(height: 20),
                              _isLoading && _reviews.isEmpty
                                  ? const Center(
                                      child: CircularProgressIndicator(
                                        valueColor: AlwaysStoppedAnimation<Color>(
                                          Colors.green,
                                        ),
                                      ),
                                    )
                                  : Center(
                                      child: AnimatedScaleButton(
                                        onPressed: submitReview,
                                        child: Container(
                                          decoration: BoxDecoration(
                                            gradient: LinearGradient(
                                              colors: [
                                                Colors.green[500]!,
                                                Colors.green[700]!,
                                              ],
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(30),
                                            boxShadow: [
                                              BoxShadow(
                                                color: Colors.black
                                                    .withOpacity(0.2),
                                                blurRadius: 8,
                                                offset: const Offset(0, 4),
                                              ),
                                            ],
                                          ),
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 24,
                                            vertical: 12,
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: const [
                                              Icon(Icons.send, color: Colors.white),
                                              SizedBox(width: 8),
                                              Text(
                                                'ສົ່ງຣີີວິວ',
                                                style: TextStyle(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 16,
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
                      const SizedBox(height: 20),
                      Row(
                        children: const [
                          Icon(Icons.reviews, color: Colors.black87),
                          SizedBox(width: 8),
                          Text(
                            'ຣີີວິວທັງໝົດ',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      if (_isLoading && _reviews.isNotEmpty)
                        const Center(
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Colors.green,
                            ),
                          ),
                        ),
                      _reviews.isEmpty && !_isLoading
                          ? const Center(
                              child: Text(
                                'ຍັງບໍ່ມີຣີີວິວ',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey,
                                ),
                              ),
                            )
                          : ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _reviews.length + (_hasMore && _isLoading ? 1 : 0),
                              itemBuilder: (context, index) {
                                if (index == _reviews.length && _hasMore && _isLoading) {
                                  return const Center(
                                    child: CircularProgressIndicator(
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        Colors.green,
                                      ),
                                    ),
                                  );
                                }
                                final review = _reviews[index];
                                return Card(
                                  elevation: 2,
                                  margin:
                                      const EdgeInsets.symmetric(vertical: 8),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: ListTile(
                                    contentPadding: const EdgeInsets.all(16),
                                    title: Text(
                                      '${review['name']} (@${review['username']})',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: Colors.black87,
                                      ),
                                    ),
                                    subtitle: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const SizedBox(height: 8),
                                        Row(
                                          children: List.generate(
                                            review['star'],
                                            (i) => const Icon(
                                              Icons.star,
                                              color: Colors.amber,
                                              size: 16,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        Text(
                                          review['review'],
                                          style: const TextStyle(
                                            color: Colors.black87,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          _formatDateTime(review['created_at']),
                                          style: const TextStyle(
                                            color: Colors.grey,
                                            fontSize: 12,
                                          ),
                                        ),
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
    Key? key,
    required this.onPressed,
    required this.child,
  }) : super(key: key);

  @override
  _AnimatedScaleButtonState createState() => _AnimatedScaleButtonState();
}

class _AnimatedScaleButtonState extends State<AnimatedScaleButton>
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
  }
}