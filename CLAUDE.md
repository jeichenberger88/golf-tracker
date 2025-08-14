# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Purpose

The goal of this application is to track golf statistics to help golfers improve their game. The app provides insights into performance trends, handicap tracking, and historical round data to identify areas for improvement in a golfer's performance.

## Development Commands

### Primary Commands
- `npm run dev` - Start development server with hot reload (Vite)
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Common Development Workflow
1. `npm run dev` to start development
2. `npm run lint` to check for issues before committing
3. `npm run build` to verify production build works

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 19.1.1 with modern hooks (useState)
- **Build Tool**: Vite 7.1.2 with @vitejs/plugin-react
- **Linting**: ESLint 9.33.0 with React-specific rules
- **Styling**: Pure CSS with custom properties and grid layouts

### Application Structure
This is a single-page golf tracking application with the following key components:

**Core State Management**:
- `rounds`: Array of golf round objects stored in React state
- `currentRound`: Form state for adding new rounds
- No external state management (Redux, Context, etc.) - uses local React state

**Enhanced Data Model**:
```javascript
// Comprehensive round object structure
{
  id: timestamp,
  
  // Basic Round Info
  course: string,
  date: string,
  score: number,
  par: number (default 72),
  tees: string, // 'black', 'blue', 'white', 'red', 'gold'
  
  // Course Conditions
  weather: string, // 'sunny', 'cloudy', 'overcast', 'light-rain', 'rain', 'windy'
  temperature: string, // Temperature in Fahrenheit
  wind: string, // 'calm', 'light', 'moderate', 'strong'
  courseCondition: string, // 'excellent', 'good', 'fair', 'poor'
  
  // Performance Statistics
  fairwaysHit: string, // Format: '8/14' (hit/total)
  greensInRegulation: string, // Format: '12/18' (hit/total)
  putts: string, // Total putts for the round
  chips: string, // Number of chip/pitch shots
  bunkerShots: string, // Number of bunker shots
  penalties: string, // Number of penalty strokes
  drivingDistance: string, // Average driving distance in yards
  
  // Additional Notes
  notes: string, // Free-form text for round observations
  
  // Course Information (auto-populated when available)
  courseId: string, // Unique course identifier
  courseRating: number, // Course rating for selected tees
  slopeRating: number, // Slope rating for selected tees
  yardage: number, // Course yardage for selected tees
  
  // Hole-by-Hole Scoring (optional)
  holeByHoleScores: Array<string> | null, // Array of hole scores (9 or 18)
  useHoleByHole: boolean, // Whether hole-by-hole scoring was used
  roundType: string // '9' or '18' holes
}
```

**Key Features**:
1. **AI-Powered Recommendations Engine** 🤖:
   - **Performance Analysis**: Identifies strengths and weaknesses across all game areas
   - **Practice Focus**: Specific recommendations on what to work on next
   - **Course Strategy**: Smart play suggestions based on performance patterns
   - **Weather Adaptation**: Tips for playing in different conditions
   - **Trend Analysis**: Recognizes scoring patterns and improvement areas
   - **Priority System**: High/medium/low priority recommendations with action steps

2. **Enhanced Statistics Dashboard**: 
   - Rounds played and estimated handicap
   - Best score tracking
   - Average putts per round
   - Fairways hit percentage
   - Greens in regulation percentage

3. **Smart Course Selection & Auto-Population** 🔍:
   - **Course Search**: Search from database of popular golf courses
   - **Auto-Population**: Automatic par, course rating, slope rating, and yardage based on tee selection
   - **Course Database**: Includes famous courses like Pebble Beach, Augusta National, St. Andrews
   - **Tee-Specific Data**: Different ratings and yardages for each tee box
   - **API Ready**: Prepared for integration with GolfCourseAPI.com (30,000+ courses)

4. **Flexible Scoring Options** 🎯:
   - **Round Type Selection**: Choose between 9-hole or 18-hole rounds
   - **Total Score Entry**: Traditional single score input for any round type
   - **Hole-by-Hole Scoring**: Detailed hole-by-hole score tracking with live totals
   - **Adaptive Interface**: Grid automatically adjusts for 9 or 18 holes
   - **Real-time Calculations**: Automatic front 9, back 9, and total score calculations
   - **Progress Tracking**: Visual indication of holes completed during round entry

5. **Comprehensive Round Entry Form**:
   - Basic round info (course, date, score, par, tees)
   - Course conditions (weather, temperature, wind, course condition)
   - Performance statistics (fairways hit, GIR, putts, chips, bunker shots, penalties, driving distance)
   - Round notes for observations and improvement areas

6. **Detailed Round History**: Shows last 10 rounds with:
   - Score and par differential
   - Tee selection indicator
   - Course ratings, slope, and yardage display
   - Course conditions with weather icons
   - Performance statistics grid
   - Personal notes and observations

7. **Advanced Analytics**:
   - Handicap calculation using score differential
   - Fairway accuracy percentage calculation
   - Greens in regulation percentage
   - Putting average across rounds

### File Organization
- `src/App.jsx` - Main application component with all business logic
- `src/App.css` - Component-specific styling with golf theme colors
- `src/index.css` - Global styles and CSS reset
- `src/main.jsx` - React application entry point
- Root config files: `vite.config.js`, `eslint.config.js`, `package.json`

### Styling Approach
- Uses CSS Grid and Flexbox for responsive layouts
- Custom green color scheme (#2d5016, #4a7c59) for golf theme
- Mobile-first responsive design with @media queries
- Component-scoped CSS classes with semantic naming

### ESLint Configuration
- Extends @eslint/js recommended rules
- React Hooks and React Refresh plugins enabled
- Custom rule: ignores unused vars with uppercase/underscore pattern
- Configured for JSX files with modern ECMAScript features

## Development Notes

### Data Persistence
Currently uses in-memory state only - rounds are lost on page refresh. Consider adding localStorage or database integration for production use.

### Statistics and Analytics
The application now tracks comprehensive golf performance data including:
- **Scoring**: Total score, par differential, best rounds
- **Driving**: Fairways hit percentage, average driving distance
- **Approach Play**: Greens in regulation percentage
- **Short Game**: Putting averages, chip shots, bunker play
- **Course Management**: Penalty strokes, course conditions impact
- **Environmental Factors**: Weather, temperature, wind, course conditions

### Handicap Calculation
The current handicap calculation is simplified (average differential × 0.96). Official USGA handicap calculation requires course ratings, slope ratings, and more complex algorithms.

### AI Recommendations Engine
The smart recommendations system analyzes golf performance data to provide personalized insights:

**Analysis Categories**:
- **Short Game**: Putting performance analysis with specific improvement targets
- **Driving**: Fairway accuracy assessment and distance vs accuracy optimization
- **Iron Play**: Greens in regulation analysis and approach shot recommendations
- **Course Management**: Penalty stroke reduction and smart play strategies
- **Weather Adaptation**: Performance correlation with weather conditions
- **Performance Trends**: Score trending analysis and momentum recognition
- **Course Difficulty Analysis**: Performance correlation with slope ratings and course difficulty
- **Tee Selection Optimization**: Recommends optimal tee selection based on performance data
- **Course Familiarity Impact**: Analyzes performance differences between familiar and new courses
- **Hole-by-Hole Analysis**: Identifies trouble holes and front 9 vs back 9 performance patterns
- **Round Consistency**: Tracks scoring patterns within individual rounds
- **Round Type Optimization**: Analyzes performance differences between 9-hole and 18-hole rounds
- **Format-Specific Recommendations**: Suggestions based on preferred round length and performance patterns

**Recommendation Types**:
- **Practice Focus Areas**: Specific skills to work on based on statistical weaknesses
- **Action Items**: Concrete steps to improve performance (e.g., "Practice 3-foot putts until 95% success rate")
- **Strategic Advice**: Course management tips based on individual performance patterns
- **Equipment Suggestions**: Recommendations based on distance and accuracy data
- **Mental Game**: Psychological insights from performance trends

**Priority System**: 
- 🔴 **High Priority**: Major weaknesses that significantly impact scoring
- 🟡 **Medium Priority**: Areas with moderate improvement potential
- 🟢 **Low Priority**: Strengths to maintain or minor optimizations

### Course Integration System
The application includes a sophisticated course management system:

**Course Database**:
- **Local Database**: Pre-loaded with popular courses (Pebble Beach, Augusta National, St. Andrews, etc.)
- **GolfCourseAPI.com Integration**: Live access to 30,000+ courses worldwide
- **Hybrid Search**: Combines local favorites with global course database
- **Course Search**: Real-time search functionality with autocomplete
- **Tee-Specific Data**: Accurate course ratings, slope ratings, and yardages for each tee
- **API Key**: Securely configured via environment variables (free tier: 300 requests/day)

**Auto-Population Features**:
- Automatic par setting based on course selection
- Course rating and slope rating population based on tee choice
- Yardage information for accurate performance analysis
- Course location and difficulty information

**Course-Specific AI Insights**:
- Performance analysis by course difficulty (slope rating)
- Tee selection optimization recommendations
- Course familiarity impact analysis
- Difficulty-adjusted performance expectations

### Data Analysis Opportunities
With the enhanced data model and AI engine, the application provides insights into:
- Performance trends under different weather conditions
- Correlation between course conditions and scoring
- Course difficulty impact on performance (slope rating analysis)
- Strengths and weaknesses identification (driving vs putting vs short game)
- Progress tracking over time for specific skills
- Tee selection impact on performance
- Course familiarity effects on scoring
- Personalized improvement roadmaps
- Predictive performance modeling

### API Integration
The application is configured with GolfCourseAPI.com integration:
- **API Key**: Stored securely in environment variables (`.env` file)
- **Rate Limits**: 300 requests per day (free tier)
- **Hybrid Search**: Local database + API search for comprehensive coverage
- **Error Handling**: Graceful fallback to local database if API is unavailable
- **Course Sources**: Visual indicators distinguish between local (⭐) and API (🌐) courses

### Security Configuration
**Environment Variables**:
- API keys are stored in `.env` file (never committed to git)
- `.env` is added to `.gitignore` to prevent accidental exposure
- `.env.example` provided as template for setup
- Application gracefully handles missing API keys

**Setup Instructions**:
1. Copy `.env.example` to `.env`
2. Add your GolfCourseAPI.com API key to `.env`
3. Never commit the `.env` file to version control
4. API key format: `VITE_GOLF_API_KEY=your_key_here`

### Testing
No test framework is currently configured. Consider adding Vitest for unit testing React components.