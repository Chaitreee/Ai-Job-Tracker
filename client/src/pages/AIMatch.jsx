import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useToast } from '../context/ToastContext'
import { getMe } from '../api/auth'
import { uploadResume, matchResume } from '../api/ai'

function AnimatedScore({ score }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let frame
    const duration = 800
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplayed(Math.round(progress * score))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const color =
    score >= 75 ? 'text-green-600 dark:text-green-400'
    : score >= 50 ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-600 dark:text-red-400'

  return <span className={`text-6xl font-bold tabular-nums ${color}`}>{displayed}%</span>
}

function AIMatch() {
  const { addToast } = useToast()
  const [resumeUrl, setResumeUrl] = useState(null)
  const [resumeName, setResumeName] = useState(null)
  const [checkingResume, setCheckingResume] = useState(true)

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [invalidFileSelected, setInvalidFileSelected] = useState(false)

  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    const checkResume = async () => {
      try {
        const res = await getMe()
        setResumeUrl(res.data.resumeUrl || null)
        setResumeName(res.data.resumeName || null)
      } catch (err) {
        console.error(err)
      } finally {
        setCheckingResume(false)
      }
    }
    checkResume()
  }, [])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed.')
      setInvalidFileSelected(true)
      return
    }
    setInvalidFileSelected(false)
    setUploading(true)
    setUploadError('')
    try {
      const res = await uploadResume(file)
      setResumeUrl(res.data.resumeUrl)
      setResumeName(res.data.resumeName)
      addToast('Resume uploaded successfully.', 'success')
    } catch (err) {
      console.error(err)
      setUploadError('Upload failed. Please try again.')
      addToast('Resume upload failed.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setAnalyzeError('Please paste a job description.')
      return
    }
    setAnalyzing(true)
    setAnalyzeError('')
    setResult(null)
    try {
      const res = await matchResume(jobDescription.trim())
      setResult(res.data)
      addToast('Analysis complete.', 'success')
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Something went wrong analyzing your resume.'
      setAnalyzeError(msg)
      addToast(msg, 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Navbar />
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">AI Resume Match</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resume upload */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-transparent shadow-sm">
            <h3 className="font-medium mb-3 text-slate-700 dark:text-white">1. Your Resume</h3>
            {checkingResume ? (
              <p className="text-slate-400 text-sm">Checking...</p>
            ) : (
              <>
                {resumeUrl && resumeName && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <polyline points="9 15 11 17 15 13"/>
                    </svg>
                    <span className="truncate" title={resumeName}>{resumeName}</span>
                  </div>
                )}
                <label className="block">
                  <span className="sr-only">Upload resume</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="block w-full text-sm text-slate-500 dark:text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700 file:cursor-pointer cursor-pointer"
                  />
                </label>
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                    Uploading...
                  </div>
                )}
                {uploadError && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{uploadError}</p>}
                {resumeUrl && !uploading && (
                  <p className="text-xs text-slate-400 dark:text-gray-500 mt-3">
                    Uploading a new file will replace your current resume.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Job description */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-transparent shadow-sm">
            <h3 className="font-medium mb-3 text-slate-700 dark:text-white">2. Job Description</h3>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              placeholder="Paste the job description here..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>
        </div>

        {/* Status messages */}
        <div className="flex flex-col items-center gap-2 mb-6">
          {!resumeUrl && !checkingResume && (
            <p className="text-slate-400 dark:text-gray-500 text-sm">Upload a resume before analyzing.</p>
          )}
          {resumeUrl && invalidFileSelected && (
            <p className="text-amber-600 dark:text-amber-400 text-sm">
              The selected file is not a PDF. Please choose a valid PDF to replace your current resume.
            </p>
          )}
          {analyzeError && (
            <p className="text-red-500 dark:text-red-400 text-sm">{analyzeError}</p>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !resumeUrl || invalidFileSelected}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : 'Analyze'}
          </button>
        </div>

        {result && !result.isResume && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center border border-amber-200 dark:border-amber-700/40 shadow-sm">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-amber-700 dark:text-amber-400 font-medium mb-1">This doesn't look like a valid resume.</p>
            <p className="text-slate-500 dark:text-gray-400 text-sm">Please upload a proper resume PDF and try again.</p>
          </div>
        )}

        {result && result.isResume && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col gap-6 border border-slate-200 dark:border-transparent shadow-sm">
            {/* Score */}
            <div className="flex flex-col items-center py-2">
              <AnimatedScore score={result.matchPercentage} />
              <p className="text-slate-500 dark:text-gray-400 text-sm mt-2">Match Score</p>
            </div>

            {result.summary && (
              <p className="text-slate-600 dark:text-gray-300 text-sm text-center max-w-2xl mx-auto leading-relaxed">
                {result.summary}
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {result.strengths?.length > 0 ? result.strengths.map((s, i) => (
                    <span key={i} className="text-xs bg-green-500/15 border border-green-400/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">{s}</span>
                  )) : <p className="text-slate-400 text-sm">None listed.</p>}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">Missing Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.length > 0 ? result.missingSkills.map((s, i) => (
                    <span key={i} className="text-xs bg-red-500/15 border border-red-400/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full">{s}</span>
                  )) : <p className="text-slate-400 text-sm">None listed.</p>}
                </div>
              </div>
            </div>

            {result.suggestions?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">Suggestions</h4>
                <ul className="flex flex-col gap-2">
                  {result.suggestions.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-gray-300">
                      <span className="text-blue-500 shrink-0 mt-0.5">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIMatch
