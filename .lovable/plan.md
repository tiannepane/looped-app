

# Looped - Mobile Resale App Demo

## Overview
A 7-screen mobile resale app prototype with fake data, showcasing the unique value proposition of posting items once to multiple platforms with AI-powered pricing intelligence.

---

## Design System (Foundation First)

**Color Palette:**
- Primary: Burnt orange (#E86A33 range)
- Secondary: Warm cream backgrounds
- Success: Soft green for "sold" states
- Neutral grays for text hierarchy
- White cards on light backgrounds

**Typography:**
- Clean sans-serif (Inter or similar)
- 3 heading sizes, 2 body sizes, strict hierarchy

**Components:**
- Consistent 12px/16px border radius
- Subtle shadows (no glowing effects)
- Purposeful micro-animations with easing

**Mobile Frame:**
- Fixed 390px width centered on screen
- Phone-style container with rounded corners
- Works beautifully for presentations and demos

---

## Screen-by-Screen Breakdown

### Screen 1: Home/Entry
- Welcoming headline: "What would you like to sell today?"
- Large "Start Selling" CTA button in burnt orange
- Bottom navigation: Home | My Items | Account
- Clean, minimal design with the Looped logo

### Screen 2: Photo Capture
- Camera-style interface using file upload
- "Add Photo" button supporting up to 5 images
- Horizontal scrollable thumbnail row
- Fake AI badge: "Looks like furniture 🛋️" appears after upload
- "Next" button enables only after 1+ photo added

### Screen 3: Item Description
- Title input (60 char limit with counter)
- Category dropdown (Furniture, Electronics, Appliances, Clothing, Other)
- Condition buttons: New | Like New | Good | Fair
- Description textarea (500 char limit with counter)
- Tappable AI suggestion chips below description field
- "Next" button proceeds to pricing

### Screen 4: Pricing Intelligence ⭐ Key Screen
- Large price range card: "$180 - $220 in Toronto"
- Highlighted average price: "$200"
- Demand indicator: "🔥 12 people searched for 'coffee table' this week"
- Large price input with +/- stepper buttons
- Dynamic timeline prediction that updates with price changes
- "Continue to Post" CTA

### Screen 5: Platform Selection
- Header: "Where should we post this?"
- 3 toggle switches (Facebook Marketplace, Kijiji, Carrot)
- All enabled by default
- Summary card with thumbnail, title, price
- "Post to All Platforms" button
- Brief loading animation → success → auto-navigate to Dashboard

### Screen 6: Active Listings Dashboard
- "Your Items" header with (+) add button
- 2-3 pre-populated fake listing cards showing:
  - Thumbnail, title, price
  - Message count badge
  - "Posted X days ago" timestamp
- Tapping a card opens that item's inbox
- Bottom navigation visible

### Screen 7: Unified Inbox
- Item header with title + price
- 3-5 fake buyer messages with:
  - Buyer name and message text
  - Platform badge (FB/Kijiji/Carrot icons)
  - Timestamp
- Reply input field at bottom
- Sticky "Mark as Sold" button at top
- Confirmation modal on sale → removes item → returns to Dashboard

---

## Navigation & Interactions
- All "Next" and "Continue" buttons advance screens
- Back buttons on all screens except Home
- Bottom nav on Home, Dashboard, and Inbox screens
- Smooth page transitions with subtle slide animations
- Loading states for post action
- Toast confirmations for key actions

---

## Fake Data Included
- Pre-populated listings (coffee table, vintage lamp, gaming chair)
- Fake buyer messages from realistic names
- Pricing data for Toronto market
- Platform-specific message indicators

