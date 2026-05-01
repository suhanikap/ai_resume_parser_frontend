import { useEffect, useState } from 'react';
import { FileText, Mail, Phone, Briefcase, BookOpen, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Resume } from '../types';

interface ResumeResultsProps {
  refreshTrigger?: number;
}

export function ResumeResults({ refreshTrigger }: ResumeResultsProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setResumes(data as Resume[]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">No resumes parsed yet</p>
        <p className="text-sm text-slate-400 mt-1">Upload a resume to see results here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Recent Results</h2>
        <p className="text-xs text-slate-500 mt-1">Last 5 uploaded resumes</p>
      </div>
      <div className="space-y-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {resume.name || resume.file_name || 'Unnamed Resume'}
                  </p>
                  {resume.email && (
                    <p className="text-xs text-slate-600 mt-0.5 truncate">
                      {resume.email}
                    </p>
                  )}
                  {!resume.email && (
                    <p className="text-xs text-slate-400 mt-0.5 italic">
                      Processing resume data...
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {resume.email && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{resume.email}</span>
                      </div>
                    )}
                    {resume.phone && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{resume.phone}</span>
                      </div>
                    )}
                  </div>

                  {resume.skills && Array.isArray(resume.skills) && resume.skills.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        Skills
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.slice(0, 5).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {resume.skills.length > 5 && (
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full border border-slate-200">
                            +{resume.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {resume.education && (
                    <div className="mt-3 flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {resume.education}
                      </p>
                    </div>
                  )}

                  {resume.experience && (
                    <div className="mt-2 flex items-start gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {resume.experience}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-slate-500">
                  {new Date(resume.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
