/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
			fontFamily: {
        display: ["Playfair Display", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
			fontSize: {
        "display-2xl": [
          "72px",
          {
            letterSpacing: "-0.025em",
            lineHeight: "96px",
          },
        ],
        "display-xl": [
          "60px",
          {
            letterSpacing: "-0.025em",
            lineHeight: "72px",
          },
        ],
        "display-lg": [
          "48px",
          {
            letterSpacing: "0em",
            lineHeight: "60px",
          },
        ],
        "display-md": [
          "36px",
          {
            letterSpacing: "0em",
            lineHeight: "48px",
          },
        ],
        "display-sm": [
          "30px",
          {
            letterSpacing: "0em",
            lineHeight: "40px",
          },
        ],
        "display-xs": [
          "24px",
          {
            letterSpacing: "0em",
            lineHeight: "32px",
          },
        ],
        "body-xl": [
          "20px",
          {
            letterSpacing: "0em",
            lineHeight: "32px",
          },
        ],
        "body-lg": [
          "18px",
          {
            letterSpacing: "0em",
            lineHeight: "32px",
          },
        ],
        "body-md": [
          "16px",
          {
            letterSpacing: "0em",
            lineHeight: "24px",
          },
        ],
        "body-sm": [
          "14px",
          {
            letterSpacing: "0em",
            lineHeight: "24px",
          },
        ],
        "body-xs": [
          "12px",
          {
            letterSpacing: "0em",
            lineHeight: "16px",
          },
        ],
			}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

