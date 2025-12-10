# Google AdSense Setup Guide

## ✅ What I've Fixed

Your AdSense implementation is now properly configured. Here's what was updated:

### 1. **AdSense Component** (`components/AdSense.jsx`)

- ✅ Added dependency array to useEffect hook to reinitialize when ad slots change
- ✅ Added console warnings for missing ad slots
- ✅ Improved styling with `textAlign: "center"`
- ✅ Better error handling and logging

### 2. **AdBanner Component** (`components/AdBanner.jsx`)

- ✅ Changed default size from "large" to "responsive" for mobile compatibility
- ✅ Added flex centering for better ad display
- ✅ Improved hook dependencies
- ✅ Enhanced console warnings

### 3. **Bubble Sort Page** (`app/algorithms/sorting/bubble-sort/page.js`)

- ✅ Changed all `adTest="on"` to `adTest="off"` for production
- ✅ Uncommented the disabled ads (mid-content and bottom banner)
- ✅ Replaced placeholder slot IDs with `YOUR_AD_SLOT_ID_*` placeholders

---

## 📋 Next Steps: Create Ad Slots in Google AdSense

To make the ads work, you need to create ad slots in your Google AdSense account:

### Step 1: Log in to Google AdSense

1. Go to [https://adsense.google.com](https://adsense.google.com)
2. Sign in with your Google account

### Step 2: Create Ad Slots

1. In the left sidebar, click **"Ads & sites"** → **"Ad units"**
2. Click the blue **"Create new ad unit"** button

3. For each ad location, create ad units:

#### Ad Slot 1 (Top Banner):

- **Type**: Display ads (Responsive)
- **Size**: Let it auto-adjust to responsive
- **Name**: "Bubble Sort - Top Banner"
- Copy the **Ad Slot ID** (looks like: `1234567890`)

#### Ad Slot 2 (Mid-Content):

- **Type**: Display ads (Fixed size)
- **Size**: 336x280 (Medium Rectangle)
- **Name**: "Bubble Sort - Mid Content"
- Copy the **Ad Slot ID**

#### Ad Slot 3 (Bottom Banner):

- **Type**: Display ads (Responsive)
- **Name**: "Bubble Sort - Bottom Banner"
- Copy the **Ad Slot ID**

### Step 3: Replace Placeholder IDs

Update the placeholder IDs in your code:

**File**: `app/algorithms/sorting/bubble-sort/page.js`

```javascript
// Replace these:
adSlot = "YOUR_AD_SLOT_ID_1"; // Top banner
adSlot = "YOUR_AD_SLOT_ID_2"; // Mid-content
adSlot = "YOUR_AD_SLOT_ID_3"; // Bottom banner

// With actual IDs from Google AdSense:
adSlot = "1234567890"; // Example format
```

---

## 🧪 Testing Your Ads

### During Development:

```javascript
// Use test ads to avoid policy violations
adTest = "on";
```

This will show test ads and won't count toward your actual ad performance.

### For Production:

```javascript
// Use real ads
adTest = "off";
```

---

## ✨ Current Ad Setup

Your pages now have:

1. **Top Banner Ad** (Responsive)

   - Full-width responsive display
   - Best for above-the-fold content

2. **Mid-Content Ad** (Rectangle)

   - 336x280 medium rectangle
   - Placed between code block and explanation
   - Better engagement with content

3. **Bottom Banner Ad** (Responsive)
   - Full-width responsive display
   - Good for scroll-down traffic

---

## 📊 Best Practices for Your Site

1. **Don't Click Your Own Ads**

   - This violates AdSense policies
   - Can get your account banned

2. **Limit Ad Density**

   - Current setup: 3 ads per page (good)
   - Google allows up to 3 ads per page on algorithmic-based ads

3. **Responsive Design**

   - Your setup uses responsive ads
   - ✅ Works well on mobile and desktop

4. **Ad Placement**

   - Top banner: Visible immediately (high impressions)
   - Mid-content: High engagement (near important content)
   - Bottom banner: Catches scroll traffic

5. **Monitoring Performance**
   - Check AdSense dashboard weekly
   - Monitor: CPM, CPC, CTR, and earnings
   - Adjust placement based on performance data

---

## 🔧 How to Add Ads to Other Pages

For other algorithm pages (merge-sort, quick-sort, etc.), copy the same pattern:

```javascript
import AdBanner from "@/components/AdBanner";
import AdSense from "@/components/AdSense";

export default function AlgorithmPage() {
  return (
    <main>
      {/* Top Ad */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <AdBanner
          position="top"
          size="responsive"
          adSlot="UNIQUE_SLOT_ID_1"
          adTest="off"
        />
      </div>

      {/* Content */}
      <div>Your algorithm content here</div>

      {/* Mid Ad */}
      <AdSense
        adSlot="UNIQUE_SLOT_ID_2"
        adFormat="rectangle"
        adTest="off"
        className="my-8 flex justify-center"
        adStyle={{ width: "336px", height: "280px" }}
        responsive={false}
      />

      {/* More Content */}

      {/* Bottom Ad */}
      <AdBanner
        position="bottom"
        size="responsive"
        adSlot="UNIQUE_SLOT_ID_3"
        adTest="off"
      />
    </main>
  );
}
```

---

## 📚 Resources

- [Google AdSense Help](https://support.google.com/adsense/)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [Ad Formats Guide](https://support.google.com/adsense/answer/9713)

---

## ⚠️ Common Issues & Solutions

| Issue                        | Solution                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Ads not showing              | 1. Verify ad slot IDs are correct 2. Wait 30+ minutes for ads to appear 3. Check AdSense account is approved |
| "Ads by Google" text missing | This is normal - may appear after a few impressions                                                          |
| Blank spaces                 | Ensure ad containers have proper dimensions                                                                  |
| Wrong ad size                | Verify `data-ad-format` and `adStyle` dimensions match                                                       |

---

Good luck with your AdSense! 🎉
