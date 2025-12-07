# Citizenry Website

The official website for Citizenry - the #1 US citizenship test app with unlimited mock interviews.

## Features

- Fully responsive design with modern Inter font
- Interactive contact form
- Video modal player
- Blog page with article listings
- Mobile-friendly navigation
- Beautiful gradient backgrounds
- Modern, clean UI matching the original design
- App store download badges

## Structure

```
/
├── index.html          # Main HTML file
├── blog.html           # Blog listing page
├── css/
│   ├── style.css       # Main styling
│   └── blog.css        # Blog-specific styling
├── js/
│   └── main.js         # JavaScript interactivity
├── assets/
│   ├── images/         # All images
│   └── videos/         # Video files
├── package.json
└── README.md
```

## Getting Started

### Option 1: Using Python (Recommended - Easiest)

If you have Python installed:

```bash
# Python 3
python3 -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser to: `http://localhost:8000/`

### Option 2: Using Node.js

If you have Node.js installed:

```bash
# Start the server
npm start
```

Then open your browser to: `http://localhost:8000/`

### Option 3: Using PHP

If you have PHP installed:

```bash
php -S localhost:8000
```

Then open your browser to: `http://localhost:8000/`

### Option 4: Using Live Server (VS Code Extension)

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Notes

- The promo video file is a placeholder. Replace `assets/videos/promo-video.mp4` with your actual video
- The download links point to the actual app stores and can be modified
- All images have been downloaded from the original website
- The contact form submits locally (doesn't send emails) - you'll need to add server-side handling for production use

## Customization

- Edit `index.html` or `blog.html` for content changes
- Edit `css/style.css` for main styling changes
- Edit `css/blog.css` for blog-specific styling
- Edit `js/main.js` for functionality changes
- Replace images in `assets/images/` directory
- Add your video to `assets/videos/promo-video.mp4`

## Browser Support

This website works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This is a custom implementation inspired by citizennow.com

