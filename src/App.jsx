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
