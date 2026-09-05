import React, { useState } from 'react';
import { 
  Sparkles, 
  Languages, 
  Volume2, 
  Stethoscope, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Copy, 
  Bot, 
  Send,
  Loader2,
  Building2,
  PhoneForwarded,
  HeartPulse
} from 'lucide-react';
import { LocationData, TouristProfile } from '../types';
import { DestinationPreset } from '../utils/geo';

interface AIEmergencyAssistantProps {
  currentLocation: LocationData;
  touristProfile: TouristProfile;
  selectedPreset: DestinationPreset;
}

const LANGUAGES = [
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'id', name: 'Indonesian (Bahasa)' },
  { code: 'th', name: 'Thai (ภาษาไทย)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'zh', name: 'Mandarin (中文)' },
  { code: 'de', name: 'German (Deutsch)' }
];

const FIRST_AID_PROTOCOLS = [
  {
    title: 'Severe Bleeding & Wounds',
    steps: [
      'Apply direct, firm pressure on the wound with a clean cloth or sterile gauze.',
      'Maintain pressure without lifting the cloth for at least 5-10 minutes.',
      'Elevate the injured limb above heart level if no fracture is suspected.'
    ]
  },
  {
    title: 'High Altitude Mountain Sickness',
    steps: [
      'Immediately halt ascent and descend at least 300-500 meters if symptoms worsen.',
      'Rest, hydrate with electrolytes, and keep warm to avoid hypothermia.',
      'Never leave an affected tourist alone; prepare mountain SAR beacon.'
    ]
  },
  {
    title: 'Heatstroke & Severe Dehydration',
    steps: [
      'Move tourist to shaded or air-conditioned area immediately.',
      'Apply cool, damp cloths to neck, armpits, and groin.',
      'Sip water slowly; avoid cold sugary beverages or caffeine.'
    ]
  }
];

export const AIEmergencyAssistant: React.FC<AIEmergencyAssistantProps> = ({
  currentLocation,
  touristProfile,
  selectedPreset
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Japanese (日本語)');
  const [situationText, setSituationText] = useState<string>('I need urgent police and medical assistance. My luggage was stolen and I am injured.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRunAITriage = async () => {
    if (!situationText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/emergency-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: situationText,
          category: 'MEDICAL_EMERGENCY',
          touristName: touristProfile.fullName,
          locationName: selectedPreset.name,
          targetLanguage: selectedLanguage,
          coordinates: {
            lat: currentLocation.latitude,
            lng: currentLocation.longitude
          }
        })
      });
      const data = await res.json();
      setTriageResult(data);
    } catch (err) {
      console.error("AI Triage Request Failed:", err);
      // Fallback
      setTriageResult({
        threatScore: 'HIGH',
        immediateActionSteps: [
          'Stay in an open, visible public area with bystander presence.',
          'Display the translated emergency distress card below to local authorities.',
          'Conserve phone battery and monitor AES-256 telemetry status.'
        ],
        emergencyTranslation: {
          language: selectedLanguage,
          distressPhrase: `【緊急】助けてください！警察と救急車を呼んでください。私は外国人観光客です。現在地: ${selectedPreset.name}`,
          romanizedPronunciation: "Kinkyū! Tasukete kudasai! Keisatsu to kyūkyūsha o yonde kudasai.",
          englishMeaning: "Emergency! Please help! Call police and ambulance. I am a foreign tourist."
        },
        firstAidAdvisory: "Stay calm and keep emergency contacts updated."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* AI Header Card */}
      <div className="rounded-3xl border border-rose-900/40 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-950/50">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                Gemini Emergency Safety Intelligence
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded border border-rose-500/30">
                  AI Grounded
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Instant multi-lingual distress card generation, first responder phrasebook, and threat assessment
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-300">
                Describe Your Emergency or Danger
              </label>
              <input
                id="ai-situation-input"
                type="text"
                value={situationText}
                onChange={(e) => setSituationText(e.target.value)}
                placeholder="e.g. Lost in dark alley, severe chest pain, passport snatched..."
                className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300">
                Target Language
              </label>
              <select
                id="ai-target-lang-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-white focus:border-rose-500 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <button
            id="run-ai-triage-btn"
            onClick={handleRunAITriage}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:from-rose-500 hover:to-rose-400 transition-all disabled:opacity-50 cursor-pointer w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Distress & Synthesizing Translations...</span>
              </>
            ) : (
              <>
                <Languages className="h-4 w-4" />
                <span>Generate Emergency Distress Card & AI Triage</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Distress Card */}
        {triageResult && (
          <div className="mt-6 rounded-2xl border border-rose-500/40 bg-neutral-950 p-5 shadow-2xl space-y-4">
            
            {/* Threat & Translation Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Local Distress Card ({triageResult.emergencyTranslation?.language || selectedLanguage})
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                triageResult.threatScore === 'CRITICAL' 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                Threat Level: {triageResult.threatScore || 'CRITICAL'}
              </span>
            </div>

            {/* Big High-Visibility Local Script Banner */}
            <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 text-left">
              <div className="text-lg sm:text-xl font-black text-rose-300 leading-relaxed font-sans">
                {triageResult.emergencyTranslation?.distressPhrase}
              </div>

              {triageResult.emergencyTranslation?.romanizedPronunciation && (
                <div className="mt-2 text-xs font-mono text-neutral-400 italic">
                  Pronunciation: "{triageResult.emergencyTranslation.romanizedPronunciation}"
                </div>
              )}

              <div className="mt-2 text-xs text-neutral-300 border-t border-rose-900/40 pt-2">
                <strong>English:</strong> {triageResult.emergencyTranslation?.englishMeaning}
              </div>

              {/* Action Buttons: Speak & Copy */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  id="ai-speak-btn"
                  onClick={() => handleSpeakText(triageResult.emergencyTranslation?.distressPhrase || '')}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 transition-colors"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Speak Out Loud</span>
                </button>

                <button
                  id="ai-copy-btn"
                  onClick={() => handleCopyText(triageResult.emergencyTranslation?.distressPhrase || '')}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Phrase'}</span>
                </button>
              </div>
            </div>

            {/* Immediate Action Steps */}
            {triageResult.immediateActionSteps && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Immediate Survival Actions
                </h4>
                <div className="space-y-1.5">
                  {triageResult.immediateActionSteps.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-200">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold font-mono">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* First Aid Protocol */}
            {triageResult.firstAidAdvisory && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-neutral-300">
                <span className="font-bold text-amber-400 block mb-1">⚕️ First-Aid Directive:</span>
                {triageResult.firstAidAdvisory}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Emergency First-Aid Quick Cards */}
      <div>
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-rose-500" />
          Field Survival & First-Aid Protocols
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {FIRST_AID_PROTOCOLS.map((protocol, i) => (
            <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-lg">
              <h5 className="text-xs font-bold text-rose-400 mb-2">{protocol.title}</h5>
              <ul className="space-y-1.5 text-[11px] text-neutral-300">
                {protocol.steps.map((st, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
