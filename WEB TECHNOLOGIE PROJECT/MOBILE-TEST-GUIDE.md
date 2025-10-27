# 📱 Mobile Testing Guide

## How to Test Your Website on Mobile

### Method 1: Using Python Server (Recommended)

1. **Start the server:**
   - Double-click `START-SERVER.bat` in your project folder
   - OR open terminal and run: `python server.py`

2. **Find your local IP address:**
   - The server will display your IP address
   - Example: `http://192.168.1.100:8000/`

3. **Open on your mobile:**
   - Make sure your phone is on the same WiFi network
   - Open your mobile browser
   - Enter the IP address shown (e.g., `http://192.168.1.100:8000/`)

4. **Stop the server:**
   - Press `Ctrl+C` in the terminal

---

### Method 2: Using VS Code Live Server Extension

1. **Install Live Server extension** in VS Code
2. **Right-click** on `index.html`
3. **Click** "Open with Live Server"
4. Copy the localhost URL (e.g., `http://127.0.0.1:5500`)
5. Open on mobile browser using your computer's IP address

---

### Method 3: Using ngrok (For External Testing)

1. Download ngrok from https://ngrok.com
2. Run: `ngrok http 8000`
3. Copy the public URL
4. Open on any device, anywhere!

---

### Troubleshooting

**Can't access from mobile?**
- Make sure both devices are on the same WiFi network
- Check Windows Firewall (allow Python through firewall)
- Try turning off VPN on your computer

**Button not clicking?**
- Make sure JavaScript is enabled
- Clear browser cache
- Try opening browser console for errors

**Need to test HTTPS?**
- Use ngrok (Method 3)
- Or use Live Server extension

---

### Quick Test

Run this command in terminal:
```bash
python server.py
```

Then look for this output:
```
🚀 Local Development Server Started!
📱 Open this URL on your mobile:
   http://192.168.1.XXX:8000/
```

Open that URL on your mobile browser!

---

### What to Test

✅ **Navigation Menu** - Hamburger menu on mobile
✅ **Hero Buttons** - Should scroll to sections
✅ **Portfolio Items** - Touch interactions
✅ **Contact Form** - File upload
✅ **Animations** - Should be reduced on mobile
✅ **Responsive Layout** - All sections stack properly

---

### Pro Tips

- Use Chrome DevTools mobile emulator for quick testing
- Test on real devices for accurate results
- Test both portrait and landscape orientations
- Check network throttling for slower connections

