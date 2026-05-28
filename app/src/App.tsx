import { useState } from 'react'
import { CheckCircle2, MapPin, Briefcase } from 'lucide-react'
import { ThemeSelect } from './components/ThemeSelect'
import { ResumeUploader } from './components/ResumeUploader'

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
  const [isUploading, setIsUploading] = useState(false)
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [uploadSuccess, setUploadSuccess] = useState(false)

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
      <ThemeSelect />

      <header className="header">
        <h1>In The <span className="text-gradient">Rough</span></h1>
        <p>
          Upload your resume, and our AI reads it the way a great recruiter would. 
          Discover a shortlist of roles that actually fit, surfaced from thousands of listings before you ever open a single job description.
        </p>
      </header>

      <main>
        {!uploadSuccess && (
          <ResumeUploader onFileSelected={processFile} isUploading={isUploading} />
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
