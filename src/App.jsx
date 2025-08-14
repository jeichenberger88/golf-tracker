import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [rounds, setRounds] = useState([])
  const [courseSearchResults, setCourseSearchResults] = useState([])
  const [showCourseSearch, setShowCourseSearch] = useState(false)
  const [courseSearchQuery, setCourseSearchQuery] = useState('')
  const [useHoleByHole, setUseHoleByHole] = useState(false)
  const [roundType, setRoundType] = useState('18') // '9' or '18'
  const [holeByHoleScores, setHoleByHoleScores] = useState(Array(18).fill(''))
  const [currentRound, setCurrentRound] = useState({
    course: '',
    date: '',
    score: '',
    par: 72,
    tees: 'white',
    courseId: '',
    courseRating: '',
    slopeRating: '',
    yardage: '',
    weather: '',
    temperature: '',
    wind: '',
    courseCondition: '',
    fairwaysHit: '',
    greensInRegulation: '',
    putts: '',
    chips: '',
    bunkerShots: '',
    penalties: '',
    drivingDistance: '',
    notes: '',
    holeByHoleScores: null, // Array of hole scores when using hole-by-hole
    useHoleByHole: false,
    roundType: '18' // '9' or '18' holes
  })

  // Calculate total score from hole-by-hole scores
  const calculateTotalScore = (holes, roundTypeParam = roundType) => {
    const maxHoles = roundTypeParam === '9' ? 9 : 18
    return holes.slice(0, maxHoles).filter(score => score !== '').reduce((total, score) => total + parseInt(score), 0)
  }

  // Get the number of holes for current round type
  const getHoleCount = (roundTypeParam = roundType) => {
    return roundTypeParam === '9' ? 9 : 18
  }

  // Handle hole score change
  const handleHoleScoreChange = (holeIndex, score) => {
    const newScores = [...holeByHoleScores]
    newScores[holeIndex] = score
    setHoleByHoleScores(newScores)
    
    // Auto-calculate total score
    const totalScore = calculateTotalScore(newScores, roundType)
    if (totalScore > 0) {
      setCurrentRound({...currentRound, score: totalScore})
    }
  }

  // Handle round type change
  const handleRoundTypeChange = (newRoundType) => {
    setRoundType(newRoundType)
    
    // Update par based on round type (default assumption)
    const newPar = newRoundType === '9' ? 36 : 72
    setCurrentRound({...currentRound, par: newPar, roundType: newRoundType})
    
    // Clear hole scores when switching types
    if (useHoleByHole) {
      setHoleByHoleScores(Array(18).fill(''))
      setCurrentRound({...currentRound, score: '', par: newPar, roundType: newRoundType})
    }
  }

  // Toggle between scoring methods
  const toggleScoringMethod = () => {
    const newUseHoleByHole = !useHoleByHole
    setUseHoleByHole(newUseHoleByHole)
    
    if (newUseHoleByHole) {
      // Switching to hole-by-hole: clear total score, set up hole scores
      setCurrentRound({...currentRound, score: ''})
      setHoleByHoleScores(Array(18).fill(''))
    } else {
      // Switching to total score: calculate from hole scores if available
      const totalScore = calculateTotalScore(holeByHoleScores, roundType)
      if (totalScore > 0) {
        setCurrentRound({...currentRound, score: totalScore})
      }
    }
  }

  const addRound = () => {
    const isValidRound = currentRound.course && currentRound.date && 
      (currentRound.score || (useHoleByHole && calculateTotalScore(holeByHoleScores, roundType) > 0))
    
    if (isValidRound) {
      const finalScore = useHoleByHole ? calculateTotalScore(holeByHoleScores, roundType) : currentRound.score
      const roundData = {
        ...currentRound,
        score: finalScore,
        holeByHoleScores: useHoleByHole ? [...holeByHoleScores] : null,
        useHoleByHole: useHoleByHole,
        roundType: roundType,
        id: Date.now()
      }
      
      setRounds([...rounds, roundData])
      setCurrentRound({ 
        course: '', 
        date: '', 
        score: '', 
        par: 72,
        tees: 'white',
        courseId: '',
        courseRating: '',
        slopeRating: '',
        yardage: '',
        weather: '',
        temperature: '',
        wind: '',
        courseCondition: '',
        fairwaysHit: '',
        greensInRegulation: '',
        putts: '',
        chips: '',
        bunkerShots: '',
        penalties: '',
        drivingDistance: '',
        notes: '',
        holeByHoleScores: null,
        useHoleByHole: false,
        roundType: '18',
        roundType: '18'
      })
      setUseHoleByHole(false)
      setHoleByHoleScores(Array(18).fill(''))
      setRoundType('18')
    }
  }

  const calculateHandicap = () => {
    if (rounds.length === 0) return 0
    
    // Convert 9-hole rounds to 18-hole equivalents for handicap calculation
    const normalizedScores = rounds.map(round => {
      const roundType = round.roundType || '18'
      if (roundType === '9') {
        // Double the 9-hole differential for handicap calculation
        const nineDiff = round.score - round.par
        return nineDiff * 2
      } else {
        return round.score - round.par
      }
    })
    
    const average = normalizedScores.reduce((sum, score) => sum + score, 0) / normalizedScores.length
    return Math.max(0, Math.round(average * 0.96))
  }

  // AI Recommendations Engine
  const generateRecommendations = () => {
    if (rounds.length < 2) {
      return [
        {
          category: 'Getting Started',
          icon: '🎯',
          title: 'Track More Rounds',
          description: 'Add a few more rounds to unlock personalized AI insights and recommendations.',
          priority: 'high'
        }
      ]
    }

    const recommendations = []
    const recentRounds = rounds.slice(-5) // Last 5 rounds for analysis
    
    // Calculate statistics
    const avgPutts = recentRounds.filter(r => r.putts).reduce((sum, r) => sum + parseInt(r.putts), 0) / recentRounds.filter(r => r.putts).length
    const fwHitRate = calculateFairwayPercentage(recentRounds)
    const girRate = calculateGIRPercentage(recentRounds)
    const avgScore = recentRounds.reduce((sum, r) => sum + r.score, 0) / recentRounds.length
    const avgPenalties = recentRounds.filter(r => r.penalties).reduce((sum, r) => sum + parseInt(r.penalties), 0) / recentRounds.filter(r => r.penalties).length

    // Putting Analysis
    if (avgPutts > 33) {
      recommendations.push({
        category: 'Short Game',
        icon: '⛳',
        title: 'Focus on Putting Practice',
        description: `Your recent putting average is ${avgPutts.toFixed(1)} putts per round. Tour average is 29-30. Spend 30% of practice time on putting drills.`,
        priority: 'high',
        actionItems: ['Practice 3-foot putts until 95% success rate', 'Work on lag putting from 30+ feet', 'Focus on green reading skills']
      })
    } else if (avgPutts < 30) {
      recommendations.push({
        category: 'Strength Area',
        icon: '🎯',
        title: 'Putting is Your Strength',
        description: `Excellent putting! Average of ${avgPutts.toFixed(1)} putts per round. Maintain this strength while working on other areas.`,
        priority: 'low'
      })
    }

    // Driving Analysis
    if (fwHitRate < 50 && fwHitRate > 0) {
      recommendations.push({
        category: 'Driving',
        icon: '🏌️',
        title: 'Improve Driving Accuracy',
        description: `Hitting ${fwHitRate.toFixed(0)}% of fairways. Focus on accuracy over distance. Aim for 60%+ fairway accuracy.`,
        priority: 'high',
        actionItems: ['Practice with alignment sticks', 'Consider shorter, more controlled swings', 'Work on setup and tempo']
      })
    } else if (fwHitRate > 70) {
      recommendations.push({
        category: 'Strength Area',
        icon: '💪',
        title: 'Excellent Driving Accuracy',
        description: `Outstanding fairway accuracy at ${fwHitRate.toFixed(0)}%! Consider adding distance while maintaining accuracy.`,
        priority: 'low'
      })
    }

    // Approach Shot Analysis
    if (girRate < 40 && girRate > 0) {
      recommendations.push({
        category: 'Iron Play',
        icon: '🎪',
        title: 'Work on Approach Shots',
        description: `${girRate.toFixed(0)}% GIR rate needs improvement. Tour average is 60-65%. Focus on iron accuracy and distance control.`,
        priority: 'high',
        actionItems: ['Practice with targets at driving range', 'Work on yardage precision', 'Focus on club selection']
      })
    }

    // Penalty Analysis
    if (avgPenalties > 1) {
      recommendations.push({
        category: 'Course Management',
        icon: '🧠',
        title: 'Reduce Penalty Strokes',
        description: `Averaging ${avgPenalties.toFixed(1)} penalties per round. Smart course management can save 2-3 strokes per round.`,
        priority: 'high',
        actionItems: ['Play more conservatively off tees', 'Avoid water hazards and OB', 'Choose safer targets']
      })
    }

    // Weather-based recommendations
    const windyRounds = recentRounds.filter(r => r.wind === 'strong' || r.wind === 'moderate')
    if (windyRounds.length > 0) {
      const windyAvg = windyRounds.reduce((sum, r) => sum + r.score, 0) / windyRounds.length
      const calmAvg = recentRounds.filter(r => r.wind === 'calm' || r.wind === 'light').reduce((sum, r) => sum + r.score, 0) / recentRounds.filter(r => r.wind === 'calm' || r.wind === 'light').length
      
      if (windyAvg - calmAvg > 3) {
        recommendations.push({
          category: 'Weather Adaptation',
          icon: '🌬️',
          title: 'Improve Wind Play',
          description: `You score ${(windyAvg - calmAvg).toFixed(0)} strokes higher in wind. Practice wind management techniques.`,
          priority: 'medium',
          actionItems: ['Practice lower ball flights', 'Club up and swing easier', 'Focus on balance and tempo']
        })
      }
    }

    // Score trend analysis
    if (recentRounds.length >= 3) {
      const trend = recentRounds[recentRounds.length - 1].score - recentRounds[0].score
      if (trend > 3) {
        recommendations.push({
          category: 'Performance Trend',
          icon: '📈',
          title: 'Scores Trending Up',
          description: 'Recent rounds show score increase. Consider lessons or focused practice to address fundamentals.',
          priority: 'medium'
        })
      } else if (trend < -3) {
        recommendations.push({
          category: 'Performance Trend',
          icon: '📉',
          title: 'Great Improvement!',
          description: 'Scores are trending down - keep up the excellent work! Your practice is paying off.',
          priority: 'low'
        })
      }
    }

    // Course-specific analysis
    const coursePerformance = analyzeCoursePerformance(recentRounds)
    if (coursePerformance.length > 0) {
      recommendations.push(...coursePerformance)
    }
    
    // Hole-by-hole analysis
    const holeAnalysis = analyzeHoleByHolePerformance(recentRounds)
    if (holeAnalysis.length > 0) {
      recommendations.push(...holeAnalysis)
    }
    
    // Round type analysis (9-hole vs 18-hole)
    const roundTypeAnalysis = analyzeRoundTypePerformance(rounds) // Use all rounds for this analysis
    if (roundTypeAnalysis.length > 0) {
      recommendations.push(...roundTypeAnalysis)
    }

    // If no specific issues found, provide general advice
    if (recommendations.length === 0) {
      recommendations.push({
        category: 'General',
        icon: '🎯',
        title: 'Consistent Performance',
        description: 'Your game is well-balanced! Focus on maintaining consistency and small improvements across all areas.',
        priority: 'low',
        actionItems: ['Continue current practice routine', 'Set specific improvement goals', 'Track progress over time']
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const calculateFairwayPercentage = (rounds) => {
    const validRounds = rounds.filter(r => r.fairwaysHit && r.fairwaysHit.includes('/'))
    if (validRounds.length === 0) return 0
    
    const totalHit = validRounds.reduce((sum, r) => sum + parseInt(r.fairwaysHit.split('/')[0]), 0)
    const totalAttempts = validRounds.reduce((sum, r) => sum + parseInt(r.fairwaysHit.split('/')[1]), 0)
    return (totalHit / totalAttempts) * 100
  }

  const calculateGIRPercentage = (rounds) => {
    const validRounds = rounds.filter(r => r.greensInRegulation && r.greensInRegulation.includes('/'))
    if (validRounds.length === 0) return 0
    
    const totalHit = validRounds.reduce((sum, r) => sum + parseInt(r.greensInRegulation.split('/')[0]), 0)
    const totalAttempts = validRounds.reduce((sum, r) => sum + parseInt(r.greensInRegulation.split('/')[1]), 0)
    return (totalHit / totalAttempts) * 100
  }

  // Course-specific performance analysis
  const analyzeCoursePerformance = (rounds) => {
    const courseRecommendations = []
    
    // Analyze performance by course difficulty (slope rating)
    const roundsWithSlope = rounds.filter(r => r.slopeRating)
    if (roundsWithSlope.length >= 2) {
      const hardCourses = roundsWithSlope.filter(r => parseInt(r.slopeRating) > 135)
      const easyCourses = roundsWithSlope.filter(r => parseInt(r.slopeRating) <= 125)
      
      if (hardCourses.length > 0 && easyCourses.length > 0) {
        const hardAvg = hardCourses.reduce((sum, r) => sum + (r.score - r.par), 0) / hardCourses.length
        const easyAvg = easyCourses.reduce((sum, r) => sum + (r.score - r.par), 0) / easyCourses.length
        
        if (hardAvg - easyAvg > 5) {
          courseRecommendations.push({
            category: 'Course Difficulty',
            icon: '⛰️',
            title: 'Struggling on Difficult Courses',
            description: `You score ${(hardAvg - easyAvg).toFixed(1)} strokes higher on challenging courses (slope >135). Focus on course management and conservative play.`,
            priority: 'medium',
            actionItems: ['Play more conservatively on tough courses', 'Focus on accuracy over distance', 'Practice course management scenarios']
          })
        }
      }
    }
    
    // Analyze tee selection performance
    const teePerformance = {}
    rounds.forEach(round => {
      if (!teePerformance[round.tees]) {
        teePerformance[round.tees] = []
      }
      teePerformance[round.tees].push(round.score - round.par)
    })
    
    const teeKeys = Object.keys(teePerformance).filter(tee => teePerformance[tee].length >= 2)
    if (teeKeys.length >= 2) {
      const teeAverages = {}
      teeKeys.forEach(tee => {
        teeAverages[tee] = teePerformance[tee].reduce((sum, score) => sum + score, 0) / teePerformance[tee].length
      })
      
      // Find best performing tee
      const bestTee = Object.keys(teeAverages).reduce((a, b) => teeAverages[a] < teeAverages[b] ? a : b)
      const worstTee = Object.keys(teeAverages).reduce((a, b) => teeAverages[a] > teeAverages[b] ? a : b)
      
      if (teeAverages[worstTee] - teeAverages[bestTee] > 3) {
        courseRecommendations.push({
          category: 'Tee Selection',
          icon: '📏',
          title: 'Optimize Tee Selection',
          description: `You perform ${(teeAverages[worstTee] - teeAverages[bestTee]).toFixed(1)} strokes better from ${bestTee} tees vs ${worstTee} tees. Consider playing appropriate tees for your skill level.`,
          priority: 'medium',
          actionItems: [`Play more rounds from ${bestTee} tees`, 'Choose tees based on driving distance', 'Focus on enjoyment over ego']
        })
      }
    }
    
    // Analyze course familiarity
    const courseCounts = {}
    rounds.forEach(round => {
      courseCounts[round.course] = (courseCounts[round.course] || 0) + 1
    })
    
    const familiarCourses = Object.keys(courseCounts).filter(course => courseCounts[course] >= 3)
    const newCourses = Object.keys(courseCounts).filter(course => courseCounts[course] === 1)
    
    if (familiarCourses.length > 0 && newCourses.length > 0) {
      const familiarScores = rounds.filter(r => familiarCourses.includes(r.course))
      const newScores = rounds.filter(r => newCourses.includes(r.course))
      
      const familiarAvg = familiarScores.reduce((sum, r) => sum + (r.score - r.par), 0) / familiarScores.length
      const newAvg = newScores.reduce((sum, r) => sum + (r.score - r.par), 0) / newScores.length
      
      if (newAvg - familiarAvg > 4) {
        courseRecommendations.push({
          category: 'Course Management',
          icon: '🗺️',
          title: 'New Course Strategy',
          description: `You score ${(newAvg - familiarAvg).toFixed(1)} strokes higher on unfamiliar courses. Develop a new course strategy.`,
          priority: 'medium',
          actionItems: ['Study course layout before playing', 'Play more conservatively on new courses', 'Consider a practice round or lesson']
        })
      }
    }
    
    return courseRecommendations
  }

  // Hole-by-hole performance analysis
  const analyzeHoleByHolePerformance = (rounds) => {
    const holeRecommendations = []
    const roundsWithHoles = rounds.filter(r => r.holeByHoleScores)
    
    if (roundsWithHoles.length >= 2) {
      // Calculate average score per hole
      const holeAverages = Array(18).fill(0).map((_, holeIndex) => {
        const holeScores = roundsWithHoles
          .map(r => r.holeByHoleScores[holeIndex])
          .filter(score => score && score !== '')
          .map(score => parseInt(score))
        
        return holeScores.length > 0 ? 
          holeScores.reduce((sum, score) => sum + score, 0) / holeScores.length : 0
      })
      
      // Find consistently difficult holes (scoring >1 over par on average)
      const troubleHoles = holeAverages
        .map((avg, index) => ({ hole: index + 1, average: avg }))
        .filter(hole => hole.average > 5) // Assuming par 4 average, >5 is trouble
        .sort((a, b) => b.average - a.average)
        .slice(0, 3)
      
      if (troubleHoles.length > 0) {
        holeRecommendations.push({
          category: 'Hole Analysis',
          icon: '🔴',
          title: 'Trouble Holes Identified',
          description: `You consistently struggle on holes ${troubleHoles.map(h => h.hole).join(', ')}. Average scores: ${troubleHoles.map(h => h.average.toFixed(1)).join(', ')}.`,
          priority: 'high',
          actionItems: [
            'Study course layout for these specific holes',
            'Practice approach shots for these distances',
            'Consider more conservative play on trouble holes'
          ]
        })
      }
      
      // Analyze front 9 vs back 9 performance
      const front9Scores = roundsWithHoles.map(r => 
        r.holeByHoleScores.slice(0, 9).filter(s => s).reduce((sum, s) => sum + parseInt(s), 0)
      ).filter(score => score > 0)
      
      const back9Scores = roundsWithHoles.map(r => 
        r.holeByHoleScores.slice(9, 18).filter(s => s).reduce((sum, s) => sum + parseInt(s), 0)
      ).filter(score => score > 0)
      
      if (front9Scores.length > 0 && back9Scores.length > 0) {
        const front9Avg = front9Scores.reduce((sum, s) => sum + s, 0) / front9Scores.length
        const back9Avg = back9Scores.reduce((sum, s) => sum + s, 0) / back9Scores.length
        
        if (Math.abs(front9Avg - back9Avg) > 3) {
          const worseHalf = front9Avg > back9Avg ? 'front 9' : 'back 9'
          const betterHalf = front9Avg < back9Avg ? 'front 9' : 'back 9'
          const difference = Math.abs(front9Avg - back9Avg).toFixed(1)
          
          holeRecommendations.push({
            category: 'Course Management',
            icon: '📊',
            title: `${worseHalf.charAt(0).toUpperCase() + worseHalf.slice(1)} Performance Issue`,
            description: `You score ${difference} strokes higher on the ${worseHalf} compared to the ${betterHalf}. This suggests fatigue or mental game issues.`,
            priority: 'medium',
            actionItems: [
              worseHalf === 'back 9' ? 'Work on fitness and endurance' : 'Improve warm-up routine',
              'Practice mental game and focus techniques',
              'Analyze nutrition and hydration during rounds'
            ]
          })
        }
      }
    }
    
    return holeRecommendations
  }

  // Analysis for 9-hole vs 18-hole performance
  const analyzeRoundTypePerformance = (rounds) => {
    const roundTypeRecommendations = []
    const nineHoleRounds = rounds.filter(r => r.roundType === '9')
    const eighteenHoleRounds = rounds.filter(r => (r.roundType || '18') === '18')
    
    if (nineHoleRounds.length >= 2 && eighteenHoleRounds.length >= 2) {
      // Calculate average per-hole performance
      const nineHoleAvgPerHole = nineHoleRounds.reduce((sum, r) => sum + (r.score - r.par), 0) / nineHoleRounds.length / 9
      const eighteenHoleAvgPerHole = eighteenHoleRounds.reduce((sum, r) => sum + (r.score - r.par), 0) / eighteenHoleRounds.length / 18
      
      const difference = Math.abs(nineHoleAvgPerHole - eighteenHoleAvgPerHole)
      
      if (difference > 0.3) {
        const betterFormat = nineHoleAvgPerHole < eighteenHoleAvgPerHole ? '9-hole' : '18-hole'
        const worseFormat = nineHoleAvgPerHole > eighteenHoleAvgPerHole ? '9-hole' : '18-hole'
        
        roundTypeRecommendations.push({
          category: 'Round Format',
          icon: '🔄',
          title: `${betterFormat.charAt(0).toUpperCase() + betterFormat.slice(1)} Performance Advantage`,
          description: `You perform ${difference.toFixed(1)} strokes per hole better in ${betterFormat} rounds vs ${worseFormat} rounds. This suggests ${worseFormat === '18-hole' ? 'fatigue or concentration issues in longer rounds' : 'you may rush or lack focus in shorter rounds'}.`,
          priority: 'medium',
          actionItems: [
            worseFormat === '18-hole' ? 'Work on fitness and endurance training' : 'Practice maintaining focus in shorter rounds',
            worseFormat === '18-hole' ? 'Develop better nutrition and hydration strategy' : 'Set specific goals for each hole in 9-hole rounds',
            `Play more ${worseFormat} rounds to build consistency`
          ]
        })
      }
    }
    
    // Recommend optimal practice format
    if (nineHoleRounds.length > 0 && eighteenHoleRounds.length === 0) {
      roundTypeRecommendations.push({
        category: 'Round Variety',
        icon: '🎯',
        title: 'Try 18-Hole Rounds',
        description: 'You\'ve only played 9-hole rounds. Try some 18-hole rounds to get a complete picture of your endurance and consistency.',
        priority: 'low',
        actionItems: ['Schedule an 18-hole round', 'Test your stamina over a full round', 'Compare performance between formats']
      })
    } else if (eighteenHoleRounds.length > 0 && nineHoleRounds.length === 0) {
      roundTypeRecommendations.push({
        category: 'Practice Efficiency',
        icon: '⏱️',
        title: 'Consider 9-Hole Practice Rounds',
        description: '9-hole rounds can be great for focused practice and skill development when time is limited.',
        priority: 'low',
        actionItems: ['Try 9-hole rounds for targeted practice', 'Use shorter rounds to work on specific skills', 'Practice course management in condensed format']
      })
    }
    
    return roundTypeRecommendations
  }

  // Golf Course Database (Popular courses with ratings)
  const popularCourses = {
    "Pebble Beach Golf Links": {
      id: "pebble-beach",
      name: "Pebble Beach Golf Links",
      location: "Pebble Beach, CA",
      par: 72,
      tees: {
        "Black": { yardage: 7040, rating: 76.8, slope: 150 },
        "Blue": { yardage: 6816, rating: 74.8, slope: 142 },
        "White": { yardage: 6380, rating: 72.3, slope: 135 },
        "Red": { yardage: 5672, rating: 75.1, slope: 131 }
      }
    },
    "Augusta National Golf Club": {
      id: "augusta-national",
      name: "Augusta National Golf Club",
      location: "Augusta, GA",
      par: 72,
      tees: {
        "Tournament": { yardage: 7435, rating: 76.2, slope: 137 },
        "Member": { yardage: 6965, rating: 73.9, slope: 130 }
      }
    },
    "St. Andrews Old Course": {
      id: "st-andrews",
      name: "St. Andrews Old Course",
      location: "St. Andrews, Scotland",
      par: 72,
      tees: {
        "Championship": { yardage: 7297, rating: 75.1, slope: 129 },
        "Medal": { yardage: 6721, rating: 72.1, slope: 125 },
        "Forward": { yardage: 5910, rating: 73.2, slope: 126 }
      }
    },
    "Torrey Pines Golf Course": {
      id: "torrey-pines",
      name: "Torrey Pines Golf Course (South)",
      location: "La Jolla, CA",
      par: 72,
      tees: {
        "Black": { yardage: 7698, rating: 77.4, slope: 144 },
        "Blue": { yardage: 7227, rating: 75.1, slope: 138 },
        "White": { yardage: 6874, rating: 73.2, slope: 133 },
        "Red": { yardage: 6177, rating: 75.9, slope: 130 }
      }
    },
    "Bethpage Black": {
      id: "bethpage-black",
      name: "Bethpage State Park (Black Course)",
      location: "Farmingdale, NY",
      par: 71,
      tees: {
        "Black": { yardage: 7468, rating: 77.0, slope: 144 },
        "Blue": { yardage: 7065, rating: 74.3, slope: 138 },
        "White": { yardage: 6684, rating: 72.0, slope: 132 },
        "Red": { yardage: 6112, rating: 75.2, slope: 131 }
      }
    }
  }

  // GolfCourseAPI.com integration
  const GOLF_API_KEY = import.meta.env.VITE_GOLF_API_KEY
  const GOLF_API_BASE = 'https://api.golfcourseapi.com'

  const fetchFromGolfCourseAPI = async (query) => {
    // Check if API key is available
    if (!GOLF_API_KEY) {
      console.warn('Golf API key not configured. Using local courses only.')
      return []
    }
    
    try {
      const response = await fetch(`${GOLF_API_BASE}/courses?name=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${GOLF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Transform API response to match our course structure
      return (data.courses || data.data || []).map(course => ({
        id: course.id || course.course_id,
        name: course.name || course.course_name,
        location: `${course.city || ''}, ${course.state || course.country || ''}`.trim().replace(/^,\s*/, ''),
        par: course.par || 72,
        source: 'api',
        // Note: API courses may not have detailed tee information
        tees: {
          'White': { yardage: course.yardage || '', rating: course.rating || '', slope: course.slope || '' }
        }
      }))
    } catch (error) {
      console.error('GolfCourseAPI Error:', error)
      return []
    }
  }

  // Course Search Functionality
  const searchCourses = async (query) => {
    if (query.length < 2) {
      setCourseSearchResults([])
      return
    }

    // Search local popular courses first
    const localResults = Object.values(popularCourses)
      .filter(course => 
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.location.toLowerCase().includes(query.toLowerCase())
      )
      .map(course => ({ ...course, source: 'local' }))

    // Search GolfCourseAPI.com for additional courses
    const apiResults = await fetchFromGolfCourseAPI(query)
    
    // Combine results (local first, then API)
    const combinedResults = [...localResults, ...apiResults]
    setCourseSearchResults(combinedResults.slice(0, 10)) // Limit to 10 results
  }

  // Handle course selection
  const selectCourse = (course) => {
    const selectedTee = currentRound.tees
    const teeData = course.tees?.[selectedTee] || course.tees?.['White'] || {}
    
    setCurrentRound({
      ...currentRound,
      course: course.name,
      courseId: course.id,
      par: course.par,
      courseRating: teeData.rating || '',
      slopeRating: teeData.slope || '',
      yardage: teeData.yardage || ''
    })
    setShowCourseSearch(false)
    setCourseSearchQuery('')
    setCourseSearchResults([])
  }

  // Update course data when tee selection changes
  const handleTeeChange = (newTee) => {
    // Check local database first
    let courseData = Object.values(popularCourses).find(c => c.id === currentRound.courseId)
    
    const updatedRound = {
      ...currentRound,
      tees: newTee
    }
    
    if (courseData && courseData.tees[newTee]) {
      updatedRound.courseRating = courseData.tees[newTee].rating
      updatedRound.slopeRating = courseData.tees[newTee].slope
      updatedRound.yardage = courseData.tees[newTee].yardage
    } else {
      // For API courses, may not have all tee data
      // Keep existing values or clear them
      updatedRound.courseRating = ''
      updatedRound.slopeRating = ''
      updatedRound.yardage = ''
    }
    
    setCurrentRound(updatedRound)
  }

  // Course search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (courseSearchQuery) {
        searchCourses(courseSearchQuery)
      }
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [courseSearchQuery])

  return (
    <div className="golf-app">
      <header>
        <h1>🏌️ Golf Tracker</h1>
        <p>Track your rounds and improve your game</p>
      </header>

      <div className="stats-section">
        <div className="stat-card">
          <h3>Rounds Played</h3>
          <span className="stat-number">{rounds.length}</span>
          <div className="stat-breakdown">
            <small>{rounds.filter(r => (r.roundType || '18') === '18').length} × 18-hole</small>
            <small>{rounds.filter(r => r.roundType === '9').length} × 9-hole</small>
          </div>
        </div>
        <div className="stat-card">
          <h3>Estimated Handicap</h3>
          <span className="stat-number">{calculateHandicap()}</span>
        </div>
        <div className="stat-card">
          <h3>Best Score</h3>
          <span className="stat-number">
            {rounds.length > 0 ? Math.min(...rounds.map(r => r.score)) : '-'}
          </span>
        </div>
        <div className="stat-card">
          <h3>Avg Putts</h3>
          <span className="stat-number">
            {rounds.length > 0 && rounds.some(r => r.putts) ? 
              Math.round(rounds.filter(r => r.putts).reduce((sum, r) => sum + parseInt(r.putts), 0) / rounds.filter(r => r.putts).length * 10) / 10 : '-'}
          </span>
        </div>
        <div className="stat-card">
          <h3>Fairways Hit %</h3>
          <span className="stat-number">
            {rounds.length > 0 && rounds.some(r => r.fairwaysHit) ? 
              Math.round(rounds.filter(r => r.fairwaysHit).reduce((sum, r) => sum + parseInt(r.fairwaysHit.split('/')[0] || 0), 0) / rounds.filter(r => r.fairwaysHit).reduce((sum, r) => sum + parseInt(r.fairwaysHit.split('/')[1] || 14), 0) * 100) + '%' : '-'}
          </span>
        </div>
        <div className="stat-card">
          <h3>GIR %</h3>
          <span className="stat-number">
            {rounds.length > 0 && rounds.some(r => r.greensInRegulation) ? 
              Math.round(rounds.filter(r => r.greensInRegulation).reduce((sum, r) => sum + parseInt(r.greensInRegulation.split('/')[0] || 0), 0) / rounds.filter(r => r.greensInRegulation).reduce((sum, r) => sum + parseInt(r.greensInRegulation.split('/')[1] || 18), 0) * 100) + '%' : '-'}
          </span>
        </div>
      </div>

      <div className="add-round-section">
        <h2>Add New Round</h2>
        
        <div className="form-section">
          <h3>Basic Round Info</h3>
          <div className="form-group">
            <div className="course-search-container">
              <input
                type="text"
                placeholder="Search for golf course..."
                value={showCourseSearch ? courseSearchQuery : currentRound.course}
                onChange={(e) => {
                  if (showCourseSearch) {
                    setCourseSearchQuery(e.target.value)
                  } else {
                    setCurrentRound({...currentRound, course: e.target.value})
                  }
                }}
                onFocus={() => {
                  setShowCourseSearch(true)
                  setCourseSearchQuery(currentRound.course)
                }}
              />
              <button 
                type="button" 
                className="search-toggle-btn"
                onClick={() => {
                  setShowCourseSearch(!showCourseSearch)
                  if (!showCourseSearch) {
                    setCourseSearchQuery(currentRound.course)
                  }
                }}
              >
                🔍
              </button>
              
              {showCourseSearch && courseSearchResults.length > 0 && (
                <div className="course-search-results">
                  {courseSearchResults.map((course, index) => (
                    <div 
                      key={index} 
                      className="course-result-item"
                      onClick={() => selectCourse(course)}
                    >
                      <div className="course-result-header">
                        <div className="course-result-name">{course.name}</div>
                        <span className={`course-source-badge ${course.source}`}>
                          {course.source === 'local' ? '⭐' : '🌐'}
                        </span>
                      </div>
                      <div className="course-result-location">{course.location}</div>
                      <div className="course-result-par">Par {course.par}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="date"
              value={currentRound.date}
              onChange={(e) => setCurrentRound({...currentRound, date: e.target.value})}
            />
            <div className="score-input-container">
              <div className="score-method-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={useHoleByHole}
                    onChange={toggleScoringMethod}
                  />
                  <span>Hole-by-hole scoring</span>
                </label>
              </div>
              
              {!useHoleByHole ? (
                <input
                  type="number"
                  placeholder="Total Score"
                  value={currentRound.score}
                  onChange={(e) => setCurrentRound({...currentRound, score: parseInt(e.target.value) || ''})}
                />
              ) : (
                <div className="total-score-display">
                  <span className="total-label">Total Score ({roundType} holes):</span>
                  <span className="total-value">{calculateTotalScore(holeByHoleScores, roundType) || 0}</span>
                </div>
              )}
            </div>
            <input
              type="number"
              placeholder="Par (default 72)"
              value={currentRound.par}
              onChange={(e) => setCurrentRound({...currentRound, par: parseInt(e.target.value) || 72})}
            />
            
            <select
              value={roundType}
              onChange={(e) => handleRoundTypeChange(e.target.value)}
              className="round-type-select"
            >
              <option value="18">18 Holes</option>
              <option value="9">9 Holes</option>
            </select>
            <select
              value={currentRound.tees}
              onChange={(e) => handleTeeChange(e.target.value)}
            >
              <option value="black">Black Tees</option>
              <option value="blue">Blue Tees</option>
              <option value="white">White Tees</option>
              <option value="red">Red Tees</option>
              <option value="gold">Gold Tees</option>
            </select>
            
            {currentRound.courseRating && (
              <div className="course-info-display">
                <div className="course-info-item">
                  <label>Course Rating:</label>
                  <span>{currentRound.courseRating}</span>
                </div>
                <div className="course-info-item">
                  <label>Slope Rating:</label>
                  <span>{currentRound.slopeRating}</span>
                </div>
                <div className="course-info-item">
                  <label>Yardage:</label>
                  <span>{currentRound.yardage} yards</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {useHoleByHole && (
          <div className="form-section">
            <h3>🎯 Hole-by-Hole Scoring ({roundType} Holes)</h3>
            <div className="holes-grid">
              {Array.from({length: getHoleCount()}, (_, i) => (
                <div key={i} className="hole-input">
                  <label className="hole-label">Hole {i + 1}</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    placeholder="-"
                    value={holeByHoleScores[i]}
                    onChange={(e) => handleHoleScoreChange(i, e.target.value)}
                    className="hole-score-input"
                  />
                </div>
              ))}
            </div>
            <div className="holes-summary">
              <div className="holes-progress">
                <span>Holes completed: {holeByHoleScores.slice(0, getHoleCount()).filter(score => score !== '').length}/{getHoleCount()}</span>
              </div>
              {roundType === '18' ? (
                <>
                  <div className="front-nine">
                    <span>Front 9: {calculateTotalScore(holeByHoleScores.slice(0, 9), '9')}</span>
                  </div>
                  <div className="back-nine">
                    <span>Back 9: {calculateTotalScore(holeByHoleScores.slice(9, 18), '9')}</span>
                  </div>
                </>
              ) : (
                <div className="nine-holes">
                  <span>9 Holes: {calculateTotalScore(holeByHoleScores.slice(0, 9), '9')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="form-section">
          <h3>Course Conditions</h3>
          <div className="form-group">
            <select
              value={currentRound.weather}
              onChange={(e) => setCurrentRound({...currentRound, weather: e.target.value})}
            >
              <option value="">Weather</option>
              <option value="sunny">Sunny</option>
              <option value="cloudy">Cloudy</option>
              <option value="overcast">Overcast</option>
              <option value="light-rain">Light Rain</option>
              <option value="rain">Rain</option>
              <option value="windy">Windy</option>
            </select>
            <input
              type="number"
              placeholder="Temperature (°F)"
              value={currentRound.temperature}
              onChange={(e) => setCurrentRound({...currentRound, temperature: e.target.value})}
            />
            <select
              value={currentRound.wind}
              onChange={(e) => setCurrentRound({...currentRound, wind: e.target.value})}
            >
              <option value="">Wind</option>
              <option value="calm">Calm</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="strong">Strong</option>
            </select>
            <select
              value={currentRound.courseCondition}
              onChange={(e) => setCurrentRound({...currentRound, courseCondition: e.target.value})}
            >
              <option value="">Course Condition</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Performance Statistics</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Fairways Hit (e.g., 8/14)"
              value={currentRound.fairwaysHit}
              onChange={(e) => setCurrentRound({...currentRound, fairwaysHit: e.target.value})}
            />
            <input
              type="text"
              placeholder="Greens in Regulation (e.g., 12/18)"
              value={currentRound.greensInRegulation}
              onChange={(e) => setCurrentRound({...currentRound, greensInRegulation: e.target.value})}
            />
            <input
              type="number"
              placeholder="Total Putts"
              value={currentRound.putts}
              onChange={(e) => setCurrentRound({...currentRound, putts: e.target.value})}
            />
            <input
              type="number"
              placeholder="Chips/Pitches"
              value={currentRound.chips}
              onChange={(e) => setCurrentRound({...currentRound, chips: e.target.value})}
            />
            <input
              type="number"
              placeholder="Bunker Shots"
              value={currentRound.bunkerShots}
              onChange={(e) => setCurrentRound({...currentRound, bunkerShots: e.target.value})}
            />
            <input
              type="number"
              placeholder="Penalty Strokes"
              value={currentRound.penalties}
              onChange={(e) => setCurrentRound({...currentRound, penalties: e.target.value})}
            />
            <input
              type="number"
              placeholder="Avg Driving Distance (yards)"
              value={currentRound.drivingDistance}
              onChange={(e) => setCurrentRound({...currentRound, drivingDistance: e.target.value})}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Notes</h3>
          <textarea
            placeholder="Round notes, what went well, areas to improve..."
            value={currentRound.notes}
            onChange={(e) => setCurrentRound({...currentRound, notes: e.target.value})}
            rows={3}
            style={{width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit'}}
          />
        </div>

        <button onClick={addRound} className="add-round-btn">Add Round</button>
      </div>

      {/* AI Recommendations Section */}
      <div className="recommendations-section">
        <h2>🤖 AI Recommendations</h2>
        <p className="section-subtitle">Personalized insights to improve your game</p>
        <div className="recommendations-grid">
          {generateRecommendations().map((rec, index) => (
            <div key={index} className={`recommendation-card ${rec.priority}`}>
              <div className="rec-header">
                <span className="rec-icon">{rec.icon}</span>
                <div className="rec-title-group">
                  <h3>{rec.title}</h3>
                  <span className="rec-category">{rec.category}</span>
                </div>
                <span className={`priority-badge ${rec.priority}`}>
                  {rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'}
                </span>
              </div>
              <p className="rec-description">{rec.description}</p>
              {rec.actionItems && (
                <div className="action-items">
                  <h4>Action Steps:</h4>
                  <ul>
                    {rec.actionItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounds-section">
        <h2>Recent Rounds</h2>
        {rounds.length === 0 ? (
          <p>No rounds recorded yet. Add your first round above!</p>
        ) : (
          <div className="rounds-list">
            {rounds.slice(-10).reverse().map(round => (
              <div key={round.id} className="round-card">
                <div className="round-header">
                  <h3>{round.course}</h3>
                  <span className="round-date">{round.date}</span>
                  <span className="tees-badge">{round.tees} tees</span>
                  <span className="round-type-badge">{round.roundType || '18'} holes</span>
                </div>
                
                {(round.courseRating || round.yardage) && (
                  <div className="round-course-info">
                    {round.courseRating && (
                      <span className="course-stat">Rating: {round.courseRating}</span>
                    )}
                    {round.slopeRating && (
                      <span className="course-stat">Slope: {round.slopeRating}</span>
                    )}
                    {round.yardage && (
                      <span className="course-stat">Yardage: {round.yardage}</span>
                    )}
                  </div>
                )}
                <div className="round-score">
                  <span className="score">Score: {round.score}</span>
                  <span className="vs-par">
                    {round.score - round.par > 0 ? '+' : ''}{round.score - round.par}
                  </span>
                </div>
                
                {(round.weather || round.temperature || round.wind) && (
                  <div className="round-conditions">
                    <h4>Conditions</h4>
                    <div className="conditions-grid">
                      {round.weather && <span>🌤️ {round.weather}</span>}
                      {round.temperature && <span>🌡️ {round.temperature}°F</span>}
                      {round.wind && <span>🌬️ {round.wind}</span>}
                      {round.courseCondition && <span>🏌️ {round.courseCondition}</span>}
                    </div>
                  </div>
                )}
                
                {(round.fairwaysHit || round.greensInRegulation || round.putts) && (
                  <div className="round-stats">
                    <h4>Performance</h4>
                    <div className="stats-grid">
                      {round.fairwaysHit && <span>FW: {round.fairwaysHit}</span>}
                      {round.greensInRegulation && <span>GIR: {round.greensInRegulation}</span>}
                      {round.putts && <span>Putts: {round.putts}</span>}
                      {round.chips && <span>Chips: {round.chips}</span>}
                      {round.bunkerShots && <span>Bunkers: {round.bunkerShots}</span>}
                      {round.penalties && <span>Penalties: {round.penalties}</span>}
                      {round.drivingDistance && <span>Avg Drive: {round.drivingDistance}y</span>}
                    </div>
                  </div>
                )}
                
                {round.holeByHoleScores && (
                  <div className="round-holes">
                    <h4>Hole-by-Hole Scores ({round.roundType || '18'} holes)</h4>
                    <div className="round-holes-grid">
                      {round.holeByHoleScores
                        .slice(0, round.roundType === '9' ? 9 : 18)
                        .map((score, index) => (
                        <div key={index} className="round-hole-score">
                          <span className="hole-number">{index + 1}</span>
                          <span className="hole-score">{score || '-'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="round-holes-summary">
                      {round.roundType === '9' ? (
                        <span>9 Holes: {round.holeByHoleScores.slice(0, 9).filter(s => s).reduce((sum, s) => sum + parseInt(s), 0)}</span>
                      ) : (
                        <>
                          <span>Front 9: {round.holeByHoleScores.slice(0, 9).filter(s => s).reduce((sum, s) => sum + parseInt(s), 0)}</span>
                          <span>Back 9: {round.holeByHoleScores.slice(9, 18).filter(s => s).reduce((sum, s) => sum + parseInt(s), 0)}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {round.notes && (
                  <div className="round-notes">
                    <h4>Notes</h4>
                    <p>{round.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
