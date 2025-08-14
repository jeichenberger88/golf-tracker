import { useState } from 'react'
import './App.css'

function App() {
  const [rounds, setRounds] = useState([])
  const [currentRound, setCurrentRound] = useState({
    course: '',
    date: '',
    score: '',
    par: 72,
    tees: 'white',
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
    notes: ''
  })

  const addRound = () => {
    if (currentRound.course && currentRound.date && currentRound.score) {
      setRounds([...rounds, { ...currentRound, id: Date.now() }])
      setCurrentRound({ 
        course: '', 
        date: '', 
        score: '', 
        par: 72,
        tees: 'white',
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
        notes: ''
      })
    }
  }

  const calculateHandicap = () => {
    if (rounds.length === 0) return 0
    const scores = rounds.map(round => round.score - round.par)
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
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
            <input
              type="text"
              placeholder="Course Name"
              value={currentRound.course}
              onChange={(e) => setCurrentRound({...currentRound, course: e.target.value})}
            />
            <input
              type="date"
              value={currentRound.date}
              onChange={(e) => setCurrentRound({...currentRound, date: e.target.value})}
            />
            <input
              type="number"
              placeholder="Score"
              value={currentRound.score}
              onChange={(e) => setCurrentRound({...currentRound, score: parseInt(e.target.value) || ''})}
            />
            <input
              type="number"
              placeholder="Par (default 72)"
              value={currentRound.par}
              onChange={(e) => setCurrentRound({...currentRound, par: parseInt(e.target.value) || 72})}
            />
            <select
              value={currentRound.tees}
              onChange={(e) => setCurrentRound({...currentRound, tees: e.target.value})}
            >
              <option value="black">Black Tees</option>
              <option value="blue">Blue Tees</option>
              <option value="white">White Tees</option>
              <option value="red">Red Tees</option>
              <option value="gold">Gold Tees</option>
            </select>
          </div>
        </div>

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
                </div>
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
