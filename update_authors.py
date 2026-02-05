import json
import os

files_to_update = [
    '/Users/noamsadi/Desktop/nsmprime-main/nsmprime-1/data/posts.json',
    '/Users/noamsadi/Desktop/nsmprime-main/nsmprime-1/public/data/posts.json'
]

authors_map = {
    "David Thompson": {
        "name": "David Thompson",
        "jobTitle": "Digital Marketing Manager",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        "bio": "Experienced PPC and digital advertising specialist. Manages multi-million dollar ad budgets and consistently delivers exceptional ROI for clients.",
        "url": "/about.html#team",
        "socialLinks": {
            "linkedin": "#",
            "twitter": "#"
        }
    },
    "Sarah Martinez": {
        "name": "Sarah Johnson",
        "jobTitle": "Lead Web Developer",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        "bio": "Full-stack developer with 10+ years of experience in creating responsive, high-performance websites. Expert in React, Node.js, and modern web technologies.",
        "url": "/about.html#team",
        "socialLinks": {
            "linkedin": "#",
            "twitter": "#"
        }
    },
    "Sarah Johnson": { # Handle case where I partially updated it already
       "name": "Sarah Johnson",
        "jobTitle": "Lead Web Developer",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        "bio": "Full-stack developer with 10+ years of experience in creating responsive, high-performance websites. Expert in React, Node.js, and modern web technologies.",
        "url": "/about.html#team",
        "socialLinks": {
            "linkedin": "#",
            "twitter": "#"
        }
    },
    "Michael Chen": {
        "name": "Marcus Chen",
        "jobTitle": "SEO & Content Strategist",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        "bio": "Digital marketing strategist specializing in SEO, content marketing, and analytics. Helped 200+ businesses achieve first-page Google rankings.",
        "url": "/about.html#team",
        "socialLinks": {
            "linkedin": "#",
            "twitter": "#"
        }
    },
    "Marcus Chen": {
        "name": "Marcus Chen",
        "jobTitle": "SEO & Content Strategist",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        "bio": "Digital marketing strategist specializing in SEO, content marketing, and analytics. Helped 200+ businesses achieve first-page Google rankings.",
        "url": "/about.html#team",
        "socialLinks": {
            "linkedin": "#",
            "twitter": "#"
        }
    },
    "Jessica Rodriguez": {
        "name": "Emily Rodriguez",
        "jobTitle": "Creative Director",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        "bio": "Award-winning designer with expertise in branding, UI/UX design, and visual storytelling. Passionate about creating compelling digital experiences.",
        "url": "/about.html#team",
        "socialLinks": {
            "linkedin": "#",
            "twitter": "#"
        }
    },
    "Emily Rodriguez": {
        "name": "Emily Rodriguez",
        "jobTitle": "Creative Director",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        "bio": "Award-winning designer with expertise in branding, UI/UX design, and visual storytelling. Passionate about creating compelling digital experiences.",
        "url": "/about.html#team",
        "socialLinks": {
            "linkedin": "#",
            "twitter": "#"
        }
    }
}

for file_path in files_to_update:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path}, not found.")
        continue

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        updated_count = 0
        posts = data.get('posts', []) if isinstance(data, dict) else data
        
        for post in posts:
            current_author_name = post['author']['name']
            if current_author_name in authors_map:
                post['author'] = authors_map[current_author_name]
                updated_count += 1
        
        if isinstance(data, dict):
            data['posts'] = posts
        else:
            data = posts # should be strict about structure
            
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
            
        print(f"Updated {updated_count} posts in {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
