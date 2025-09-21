
import React from 'react';

interface Subject {
  key: string;
  title: string;
  description: string;
  icon: string;
}

const subjects: Subject[] = [
  {
    key: 'history',
    title: 'História do Brasil',
    description: 'Viaje no tempo e descubra os momentos mais importantes do nosso país.',
    icon: '📜',
  },
  {
    key: 'geography',
    title: 'Geografia do Brasil',
    description: 'Explore os incríveis biomas e as paisagens diversas do Brasil.',
    icon: '🗺️',
  },
  {
    key: 'math',
    title: 'Matemática',
    description: 'Desvende os mistérios dos números com desafios divertidos!',
    icon: '➕',
  },
  {
    key: 'science',
    title: 'Ciências (Em Breve)',
    description: 'Investigue a natureza, o corpo humano e o universo.',
    icon: '🔬',
  }
];

interface SubjectSelectionScreenProps {
  studentName: string;
  onSelectSubject: (subjectKey: string) => void;
  onClearCache: () => void;
}

const SubjectSelectionScreen: React.FC<SubjectSelectionScreenProps> = ({ studentName, onSelectSubject, onClearCache }) => {
  return (
    <div className="container mx-auto max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-amber-300">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-display text-amber-800">
          Olá, {studentName}!
        </h1>
        <p className="text-xl text-amber-900 mt-2">
          Qual metaverso você quer explorar hoje?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {subjects.map((subject) => {
          const isComingSoon = subject.title.includes('(Em Breve)');
          return (
            <button
              key={subject.key}
              onClick={() => onSelectSubject(subject.key)}
              disabled={isComingSoon}
              className={`p-6 bg-white rounded-2xl shadow-lg border-4 border-transparent hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-left
                ${isComingSoon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={isComingSoon ? `${subject.title} (em breve)` : `Iniciar aventura de ${subject.title}`}
            >
              <div className="flex items-center gap-6">
                <div className="text-5xl bg-amber-100 p-4 rounded-xl">
                  {subject.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-display text-blue-800">{subject.title}</h2>
                  <p className="text-amber-900 mt-1">{subject.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onClearCache}
          className="text-gray-600 hover:text-red-700 underline transition-colors px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Esquecer imagens e gerar novas na próxima aventura
        </button>
      </div>
    </div>
  );
};

export default SubjectSelectionScreen;