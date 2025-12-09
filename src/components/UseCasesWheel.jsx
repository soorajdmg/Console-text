import './UseCasesWheel.css';

const UseCasesWheel = () => {
  const useCases = [
    'Payment gateway failures',
    'API endpoint health',
    'Authentication errors',
    'Database connection issues',
    'Third-party integrations',
    'Rate limiting breaches',
    'Deployment rollouts',
    'Critical workflow errors',
  ];

  return (
    <section className="use-cases-wheel-section">
      <div className="wheel-content">
        {/* Left side - Static headline */}
        <div className="wheel-headline">
          <h2>Where It<br /> Works?</h2>
        </div>

        {/* Right side - Wheel container with viewport */}
        <div className="wheel-container">
          {/* List-based arrangement */}
          <div className="wheel-viewport">
            <div className="wheel-items">
              {useCases.map((useCase, index) => (
                <div key={index} className="wheel-item">
                  <span className="wheel-item-dot"></span>
                  <span className="wheel-item-text">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesWheel;
