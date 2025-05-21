class User {
  final int id;
  final String username;
  final String email;
  final String phone; // ถ้ามี token หรือข้อมูลอื่นเพิ่มได้อีก
  final String? name; // ສໍາລັບການໃຊ້ງານໃນອະນາຄົດ

  User({
    required this.id,
    required this.username,
    required this.email,

    required this.phone,
    required this.name,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      phone: json['phone'],
      name: json['name'],
    );
  }
}
