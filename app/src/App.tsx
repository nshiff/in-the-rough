import { useState, useRef, useEffect } from 'react'
import { UploadCloud, CheckCircle2, MapPin, Briefcase, Sun, Moon, Monitor } from 'lucide-react'

// Define types based on backend schema
interface JobMatch {
  id: string
  title: string
  company: string
  location: string
  match_score: number
  reasoning: string
}

function App() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme-preference')
    return (saved as 'system' | 'light' | 'dark') || 'system'
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const root = document.documentElement
    
    const applyTheme = () => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (isDark) root.classList.add('dark')
        else root.classList.remove('dark')
      } else if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
    
    applyTheme()
    
    // Listen for system theme changes if in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') applyTheme()
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as 'system' | 'light' | 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme-preference', newTheme)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      await processFile(files[0])
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0])
    }
  }

  const processFile = async (file: File) => {
    // Check if it's a valid file type (pdf, docx, txt) - simplified check
    setIsUploading(true)
    setUploadSuccess(false)
    setJobs([])
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      // 1. Upload the resume
      const uploadRes = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      setUploadSuccess(true)

      // 2. Fetch the jobs shortlist
      const jobsRes = await fetch('http://127.0.0.1:8000/api/jobs')
      if (!jobsRes.ok) throw new Error('Failed to fetch jobs')
      
      const jobsData: JobMatch[] = await jobsRes.json()
      setJobs(jobsData)

    } catch (error) {
      console.error('Error processing resume:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container animate-fade-in">
      <div className="theme-select-container">
        {theme === 'system' ? <Monitor size={16} /> : theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        <select 
          className="theme-select" 
          value={theme} 
          onChange={handleThemeChange}
          aria-label="Select theme"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <header className="header">
        <h1>In The <span className="text-gradient">Rough</span></h1>
        <p>
          Upload your resume, and our AI reads it the way a great recruiter would. 
          Discover a shortlist of roles that actually fit, surfaced from thousands of listings before you ever open a single job description.
        </p>
      </header>

      <main>
        {!uploadSuccess && (
          <div 
            className={`uploader-box ${isDragging ? 'drag-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="loader">
                <div className="spinner"></div>
                <p>Analyzing your career trajectory...</p>
              </div>
            ) : (
              <>
                <UploadCloud className="uploader-icon" />
                <h2>Drop your resume here</h2>
                <p className="text-muted">Supports PDF, DOCX, and TXT files</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileInput} 
                  style={{ display: 'none' }}
                  accept=".pdf,.docx,.txt"
                />
                <button className="btn" style={{ marginTop: '1.5rem' }}>
                  Browse Files
                </button>
              </>
            )}
          </div>
        )}

        {uploadSuccess && jobs.length > 0 && (
          <div className="job-list animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <CheckCircle2 color="var(--accent)" /> Your Curated Shortlist
              </h2>
              <button className="btn" onClick={() => {
                setUploadSuccess(false)
                setJobs([])
              }} style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                Upload another resume
              </button>
            </div>
            
            {jobs.map(job => (
              <div key={job.id} className="card">
                <div className="job-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">
                      <Briefcase size={16} /> {job.company} &nbsp;&bull;&nbsp; <MapPin size={16} /> {job.location}
                    </p>
                  </div>
                  <div className="match-score">
                    {job.match_score}% Match
                  </div>
                </div>
                <div className="job-reasoning">
                  <strong>Why it's a fit:</strong> {job.reasoning}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
