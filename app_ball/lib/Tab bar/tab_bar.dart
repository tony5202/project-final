import 'package:app_ball/Modle/user_model.dart';
import 'package:app_ball/Tab%20bar/history.dart';
import 'package:app_ball/Tab%20bar/homePage.dart';
import 'package:app_ball/Tab%20bar/profile.dart';
import 'package:app_ball/Tab%20bar/reviwe.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class MyTabBar extends StatefulWidget {
  final User user;
  final int initialIndex; // Add parameter to set initial tab

  const MyTabBar({super.key, required this.user, this.initialIndex = 0});

  @override
  _MyTabBarState createState() => _MyTabBarState();
}

class _MyTabBarState extends State<MyTabBar> {
  late CupertinoTabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = CupertinoTabController(initialIndex: widget.initialIndex);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoTabScaffold(
      tabBar: CupertinoTabBar(
        backgroundColor: Colors.green[800],
        activeColor: Colors.white,
        inactiveColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.stadium),
            label: "ຈອງເດີ່ນ",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history),
            label: "ປະຫວັດການຈອງ",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.star),
            label: "ເບິ່ງການຄະແນມ",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: "ຂໍ້ມູນຂອງຂ້ອຍ",
          ),
        ],
      ),
      controller: _tabController, // Assign controller
      tabBuilder: (context, index) {
        return CupertinoTabView(
          builder: (context) {
            switch (index) {
              case 0:
                return Homepage(user: widget.user);
              case 1:
                return History(user: widget.user);
              case 2:
                return Review(user: widget.user);
              case 3:
                return Profile(user: widget.user);
              default:
                return Homepage(user: widget.user);
            }
          },
        );
      },
    );
  }
}