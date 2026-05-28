import { useState } from 'react'
import { CheckCircle2, MapPin, Briefcase } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
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
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const processResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://127.0.0.1:8000/api/search-jobs', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to search jobs')
      
      return response.json() as Promise<JobMatch[]>
    },
    onSuccess: (data) => {
      setJobs(data)
      setUploadSuccess(true)
    },
    onError: (error) => {
      console.error('Error processing resume:', error)
    }
  })

  return (
    <div className="container">
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
          <>
            <ResumeUploader 
              onFileSelected={(file) => processResumeMutation.mutate(file)} 
              isUploading={processResumeMutation.isPending} 
            />
            {processResumeMutation.isError && (
              <div className="error-message">
                Something went wrong while processing your resume. Please try again.
              </div>
            )}
          </>
        )}

        {uploadSuccess && jobs.length > 0 && (
          <div className="job-list">
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
