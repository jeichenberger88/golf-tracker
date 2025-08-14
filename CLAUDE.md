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
  notes: string // Free-form text for round observations
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

3. **Comprehensive Round Entry Form**:
   - Basic round info (course, date, score, par, tees)
   - Course conditions (weather, temperature, wind, course condition)
   - Performance statistics (fairways hit, GIR, putts, chips, bunker shots, penalties, driving distance)
   - Round notes for observations and improvement areas

4. **Detailed Round History**: Shows last 10 rounds with:
   - Score and par differential
   - Tee selection indicator
   - Course conditions with weather icons
   - Performance statistics grid
   - Personal notes and observations

5. **Advanced Analytics**:
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

### Data Analysis Opportunities
With the enhanced data model and AI engine, the application provides insights into:
- Performance trends under different weather conditions
- Correlation between course conditions and scoring
- Strengths and weaknesses identification (driving vs putting vs short game)
- Progress tracking over time for specific skills
- Tee selection impact on performance
- Personalized improvement roadmaps
- Predictive performance modeling

### Testing
No test framework is currently configured. Consider adding Vitest for unit testing React components.