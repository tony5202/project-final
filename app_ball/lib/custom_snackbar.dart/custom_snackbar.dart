import 'package:flutter/material.dart';

class CustomSnackBar {
  static void show(
    BuildContext context, {
    required String message,
    Color? backgroundColor,
    Duration duration = const Duration(seconds: 4),
    IconData icon = Icons.sports_soccer,
  }) {
    final overlay = Overlay.of(context);
    final overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        top: 50.0,
        left: 16.0,
        right: 16.0,
        child: _AnimatedSnackBar(
          message: message,
          backgroundColor: backgroundColor ?? Colors.red[600]!,
          duration: duration,
          icon: icon,
        ),
      ),
    );

    overlay.insert(overlayEntry);

    Future.delayed(duration, () {
      overlayEntry.remove();
    });
  }
}

class _AnimatedSnackBar extends StatefulWidget {
  final String message;
  final Color backgroundColor;
  final Duration duration;
  final IconData icon;

  const _AnimatedSnackBar({
    required this.message,
    required this.backgroundColor,
    required this.duration,
    required this.icon,
  });

  @override
  __AnimatedSnackBarState createState() => __AnimatedSnackBarState();
}

class __AnimatedSnackBarState extends State<_AnimatedSnackBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _slideAnimation;
  late Animation<double> _bounceAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _slideAnimation = Tween<double>(begin: -100.0, end: 0.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );
    _bounceAnimation = Tween<double>(begin: 1.0, end: 1.05).animate(
      CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _slideAnimation.value),
          child: ScaleTransition(
            scale: _bounceAnimation,
            child: Material(
              elevation: 8.0,
              borderRadius: BorderRadius.circular(12.0),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      widget.backgroundColor,
                      widget.backgroundColor.withOpacity(0.8),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12.0),
                  border: Border.all(color: Colors.white, width: 1.0),
                ),
                child: Row(
                  children: [
                    Icon(widget.icon, color: Colors.white, size: 24.0),
                    const SizedBox(width: 12.0),
                    Expanded(
                      child: Text(
                        widget.message,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16.0,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Roboto',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}