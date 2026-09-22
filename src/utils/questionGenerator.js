/**
 * Utility to generate 60 authentic KCET-style questions per set for any subject.
 * Supports Sets A, B, C, D (240 questions total per exam across 4 sets).
 */

const RAW_QUESTIONS = {
  Mathematics: [
    // 1-10: Differential Calculus
    { q: "What is the derivative of f(x) = sin(x²) with respect to x?", opts: ["2x cos(x²)", "cos(x²)", "-2x cos(x²)", "2x sin(x²)"], ans: "0", topic: "Differential Calculus", exp: "By chain rule: d/dx[sin(x²)] = cos(x²) · d/dx[x²] = 2x cos(x²)." },
    { q: "The derivative of e^(3x) with respect to x is:", opts: ["3 e^(3x)", "e^(3x)", "3x e^(3x-1)", "e^(3x) / 3"], ans: "0", topic: "Differential Calculus", exp: "d/dx[e^(3x)] = 3 e^(3x)." },
    { q: "If y = ln(cos x), then dy/dx is equal to:", opts: ["-tan x", "tan x", "cot x", "-cot x"], ans: "0", topic: "Differential Calculus", exp: "d/dx[ln(cos x)] = (1/cos x) · (-sin x) = -tan x." },
    { q: "The derivative of tan⁻¹(x) with respect to x is:", opts: ["1 / (1 + x²)", "1 / √(1 - x²)", "-1 / (1 + x²)", "1 / (x² - 1)"], ans: "0", topic: "Differential Calculus", exp: "Standard derivative formula d/dx[arctan x] = 1 / (1 + x²)." },
    { q: "If y = x^x, then dy/dx is:", opts: ["x^x (1 + ln x)", "x · x^(x-1)", "x^x ln x", "1 + ln x"], ans: "0", topic: "Differential Calculus", exp: "Taking ln y = x ln x, differentiating gives (1/y) dy/dx = 1 + ln x." },
    { q: "The value of lim (x → 0) [sin(5x) / x] is equal to:", opts: ["5", "1", "0", "1/5"], ans: "0", topic: "Limits & Continuity", exp: "lim x→0 sin(kx)/x = k, so lim sin(5x)/x = 5." },
    { q: "Critical points of f(x) = x³ - 3x on ℝ occur at x =:", opts: ["±1", "0", "±3", "±√3"], ans: "0", topic: "Applications of Derivatives", exp: "f'(x) = 3x² - 3 = 0 ⇒ x² = 1 ⇒ x = ±1." },
    { q: "The slope of normal to curve y = x² at point (1, 1) is:", opts: ["-1/2", "2", "1/2", "-2"], ans: "0", topic: "Applications of Derivatives", exp: "dy/dx = 2x = 2 at x=1. Slope of normal is -1/m = -1/2." },
    { q: "If x = a cos t and y = a sin t, then dy/dx is:", opts: ["-cot t", "-tan t", "tan t", "cot t"], ans: "0", topic: "Parametric Differentiation", exp: "dy/dx = (dy/dt)/(dx/dt) = (a cos t)/(-a sin t) = -cot t." },
    { q: "Maximum value of sin x + cos x is:", opts: ["√2", "2", "1", "1/√2"], ans: "0", topic: "Trigonometric Maxima", exp: "A sin x + B cos x has max value √(A² + B²) = √(1 + 1) = √2." },

    // 11-20: Integral Calculus
    { q: "The indefinite integral ∫ (1 / x) dx for x ≠ 0 is:", opts: ["ln|x| + C", "-1 / x² + C", "e^x + C", "x ln x + C"], ans: "0", topic: "Integral Calculus", exp: "Standard antiderivative of 1/x is ln|x| + C." },
    { q: "Evaluate ∫ e^(2x) dx:", opts: ["(1/2) e^(2x) + C", "2 e^(2x) + C", "e^(2x) + C", "(1/4) e^(2x) + C"], ans: "0", topic: "Integral Calculus", exp: "∫ e^(kx) dx = (1/k) e^(kx) + C." },
    { q: "The value of definite integral ∫₀^(π/2) sin x dx is:", opts: ["1", "0", "2", "π/2"], ans: "0", topic: "Definite Integrals", exp: "[-cos x] from 0 to π/2 = -cos(π/2) - (-cos 0) = 0 + 1 = 1." },
    { q: "Evaluate ∫ (1 / (1 + x²)) dx:", opts: ["tan⁻¹ x + C", "sin⁻¹ x + C", "sec⁻¹ x + C", "ln(1+x²) + C"], ans: "0", topic: "Integral Calculus", exp: "Standard integral formula for tan⁻¹ x." },
    { q: "Evaluate ∫ x e^x dx using integration by parts:", opts: ["(x - 1) e^x + C", "(x + 1) e^x + C", "x e^x + C", "x² e^x / 2 + C"], ans: "0", topic: "Integration by Parts", exp: "∫ x e^x dx = x e^x - ∫ e^x dx = (x - 1) e^x + C." },
    { q: "The area bounded by y = x², x-axis and lines x = 0, x = 3 is:", opts: ["9 sq units", "27 sq units", "3 sq units", "18 sq units"], ans: "0", topic: "Area Under Curves", exp: "∫₀³ x² dx = [x³/3]₀³ = 27/3 = 9." },
    { q: "Evaluate ∫ (1 / √(1 - x²)) dx:", opts: ["sin⁻¹ x + C", "cos⁻¹ x + C", "tan⁻¹ x + C", "ln|x| + C"], ans: "0", topic: "Integral Calculus", exp: "Standard antiderivative of 1/√(1-x²) is sin⁻¹ x + C." },
    { q: "Evaluate ∫ tan x dx:", opts: ["ln|sec x| + C", "sec² x + C", "-ln|sin x| + C", "ln|cos x| + C"], ans: "0", topic: "Integral Calculus", exp: "∫ tan x dx = ∫ (sin x / cos x) dx = -ln|cos x| = ln|sec x| + C." },
    { q: "The value of ∫₀¹ x³ dx is:", opts: ["1/4", "1/3", "1/2", "1"], ans: "0", topic: "Definite Integrals", exp: "[x⁴ / 4] from 0 to 1 = 1/4." },
    { q: "If f(x) is an odd function, then ∫₋ₐᵃ f(x) dx is equal to:", opts: ["0", "2 ∫₀ᵃ f(x) dx", "a", "2a"], ans: "0", topic: "Definite Integrals Properties", exp: "Integral of any odd function over symmetric interval [-a, a] is zero." },

    // 21-30: Vector Algebra & 3D Geometry
    { q: "If vectors A and B are mutually perpendicular, their dot product A · B is:", opts: ["0", "1", "|A||B|", "-1"], ans: "0", topic: "Vector Algebra", exp: "A · B = |A||B| cos(90°) = 0." },
    { q: "Magnitude of vector v = i + 2j - 2k is:", opts: ["3", "5", "9", "sqrt(5)"], ans: "0", topic: "Vector Algebra", exp: "|v| = √(1² + 2² + (-2)²) = √(1 + 4 + 4) = √9 = 3." },
    { q: "The cross product i × j is equal to:", opts: ["k", "-k", "0", "1"], ans: "0", topic: "Vector Algebra", exp: "By right-hand rule for unit vectors, i × j = k." },
    { q: "Direction cosines of the positive x-axis are:", opts: ["(1, 0, 0)", "(0, 1, 0)", "(0, 0, 1)", "(1, 1, 1)"], ans: "0", topic: "3D Geometry", exp: "Angles with x, y, z axes are 0°, 90°, 90° ⇒ (cos 0, cos 90, cos 90) = (1, 0, 0)." },
    { q: "Distance of point P(3, 4, 12) from the origin is:", opts: ["13", "12", "5", "169"], ans: "0", topic: "3D Geometry", exp: "d = √(3² + 4² + 12²) = √(9 + 16 + 144) = √169 = 13." },
    { q: "The angle between two vectors A and B with A · B = 0 is:", opts: ["90°", "0°", "180°", "45°"], ans: "0", topic: "Vector Algebra", exp: "Dot product zero implies vectors are orthogonal (90°)." },
    { q: "Equation of plane passing through (1,0,0), (0,1,0), (0,0,1) is:", opts: ["x + y + z = 1", "x + y + z = 0", "x - y + z = 1", "x + y - z = 1"], ans: "0", topic: "3D Geometry", exp: "Intercept form x/a + y/b + z/c = 1 with a=b=c=1 yields x + y + z = 1." },
    { q: "The scalar triple product [A B C] is zero when:", opts: ["Vectors are coplanar", "Vectors are perpendicular", "Vectors are unit vectors", "Vectors are collinear only"], ans: "0", topic: "Vector Algebra", exp: "Volume of parallelopiped formed by coplanar vectors is zero." },
    { q: "Projection of vector A = 2i + 3j + 2k on B = i + 2j + k is:", opts: ["10 / √6", "8 / √6", "5 / √6", "12 / √6"], ans: "0", topic: "Vector Algebra", exp: "Projection = (A · B) / |B| = (2*1 + 3*2 + 2*1) / √(1+4+1) = 10 / √6." },
    { q: "Distance between parallel planes 2x + y + 2z = 8 and 2x + y + 2z = 2 is:", opts: ["2 units", "6 units", "3 units", "4 units"], ans: "0", topic: "3D Geometry", exp: "d = |d1 - d2| / √(a²+b²+c²) = |8 - 2| / √(4+1+4) = 6/3 = 2." },

    // 31-40: Matrices & Determinants
    { q: "The value of determinant | 1  2 | / | 3  4 | is:", opts: ["-2", "2", "-10", "10"], ans: "0", topic: "Determinants", exp: "(1*4) - (2*3) = 4 - 6 = -2." },
    { q: "If A is a square matrix of order n, then det(k A) equals:", opts: ["k^n det(A)", "k det(A)", "n k det(A)", "k^(n-1) det(A)"], ans: "0", topic: "Determinants Properties", exp: "Factoring k from each of n rows gives k^n det(A)." },
    { q: "If matrix A is singular, then its determinant det(A) is:", opts: ["0", "1", "-1", "Undefined"], ans: "0", topic: "Matrices", exp: "By definition, a singular matrix has determinant zero and no inverse." },
    { q: "For any square matrix A, A + Aᵀ is always:", opts: ["Symmetric matrix", "Skew-symmetric matrix", "Diagonal matrix", "Identity matrix"], ans: "0", topic: "Matrices", exp: "(A + Aᵀ)ᵀ = Aᵀ + (Aᵀ)ᵀ = Aᵀ + A = A + Aᵀ." },
    { q: "If A · B = I, where I is identity matrix, then B is:", opts: ["Inverse of A (A⁻¹)", "Transpose of A", "Adjoint of A", "Determinant of A"], ans: "0", topic: "Matrices", exp: "Definition of inverse matrix: A A⁻¹ = I." },
    { q: "The trace of a square matrix is the sum of its:", opts: ["Main diagonal elements", "Off-diagonal elements", "First row elements", "Determinant values"], ans: "0", topic: "Matrices", exp: "Trace Tr(A) = ∑ a_ii." },
    { q: "For a 2x2 matrix A = [[a, b], [c, d]], adj(A) is:", opts: ["[[d, -b], [-c, a]]", "[[a, -c], [-b, d]]", "[[d, b], [c, a]]", "[[-a, b], [c, -d]]"], ans: "0", topic: "Matrices", exp: "Adjoint swaps main diagonal entries and negates off-diagonal entries." },
    { q: "If A is an invertible matrix, then det(A⁻¹) is equal to:", opts: ["1 / det(A)", "det(A)", "-det(A)", "0"], ans: "0", topic: "Determinants", exp: "det(A A⁻¹) = det(I) = 1 ⇒ det(A) det(A⁻¹) = 1 ⇒ det(A⁻¹) = 1 / det(A)." },
    { q: "A matrix A is skew-symmetric if and only if:", opts: ["Aᵀ = -A", "Aᵀ = A", "A Aᵀ = I", "det(A) = 1"], ans: "0", topic: "Matrices", exp: "Definition of skew-symmetric matrix: transpose equals negative of original." },
    { q: "The number of trivial solutions to homogeneous system AX = 0 is always at least:", opts: ["1 (Zero solution)", "0", "Infinite", "2"], ans: "0", topic: "System of Equations", exp: "X = 0 is always a solution to homogeneous linear systems." },

    // 41-50: Complex Numbers & Trigonometry
    { q: "The principal argument of complex number z = 1 + i is:", opts: ["π/4", "π/2", "π/3", "3π/4"], ans: "0", topic: "Complex Numbers", exp: "θ = tan⁻¹(1/1) = π/4 radians (45°)." },
    { q: "Modulus of complex number z = 3 + 4i is:", opts: ["5", "7", "25", "1"], ans: "0", topic: "Complex Numbers", exp: "|z| = √(3² + 4²) = √(9 + 16) = √25 = 5." },
    { q: "The value of i⁴ (where i = √-1) is:", opts: ["1", "-1", "i", "-i"], ans: "0", topic: "Complex Numbers", exp: "i² = -1 ⇒ i⁴ = (-1)² = 1." },
    { q: "Multiplicative inverse of z = 2 + 3i is:", opts: ["(2 - 3i) / 13", "(2 + 3i) / 13", "2 - 3i", "-2 - 3i"], ans: "0", topic: "Complex Numbers", exp: "z⁻¹ = z̄ / |z|² = (2 - 3i) / (4 + 9) = (2 - 3i) / 13." },
    { q: "Value of sin(15°) is equal to:", opts: ["(√6 - √2) / 4", "(√6 + √2) / 4", "1 / √2", "√3 / 2"], ans: "0", topic: "Trigonometry", exp: "sin(45° - 30°) = sin 45 cos 30 - cos 45 sin 30 = (√6 - √2) / 4." },
    { q: "General solution of sin x = 0 is:", opts: ["x = nπ, n ∈ ℤ", "x = 2nπ", "x = (2n+1)π/2", "x = nπ/2"], ans: "0", topic: "Trigonometric Equations", exp: "Sine equals zero at all integer multiples of π." },
    { q: "Domain of function f(x) = sin⁻¹(x) is:", opts: "[-1, 1]", optsArr: ["[-1, 1]", "(-∞, ∞)", "[0, π]", "(-1, 1)"], ans: "0", topic: "Inverse Trigonometry", exp: "Inverse sine is defined for real values in range [-1, 1]." },
    { q: "If tan A = 1/2 and tan B = 1/3, then A + B is equal to:", opts: ["π/4 (45°)", "π/2", "π/3", "π/6"], ans: "0", topic: "Trigonometry", exp: "tan(A+B) = (1/2 + 1/3) / (1 - 1/6) = (5/6)/(5/6) = 1 ⇒ A+B = π/4." },
    { q: "Value of cos(2x) in terms of sin x is:", opts: ["1 - 2 sin²x", "2 sin²x - 1", "1 - sin²x", "2 cos²x + 1"], ans: "0", topic: "Trigonometric Identities", exp: "Standard double angle formula cos 2x = 1 - 2 sin²x." },
    { q: "The period of function f(x) = sin(3x) is:", opts: ["2π / 3", "2π", "π / 3", "6π"], ans: "0", topic: "Trigonometry", exp: "Period of sin(kx) is 2π / k. Here k=3 ⇒ 2π / 3." },

    // 51-60: Differential Equations, Sets, Relations & Probability
    { q: "The order and degree of d²y/dx² + (dy/dx)³ = 0 are:", opts: ["Order 2, Degree 1", "Order 2, Degree 3", "Order 1, Degree 3", "Order 3, Degree 2"], ans: "0", topic: "Differential Equations", exp: "Highest derivative order is 2, raised to power 1." },
    { q: "General solution of differential equation dy/dx = y is:", opts: ["y = C e^x", "y = x + C", "y = C x", "y = e^x + C"], ans: "0", topic: "Differential Equations", exp: "dy/y = dx ⇒ ln y = x + c ⇒ y = C e^x." },
    { q: "If set A has n elements, total number of subsets of A is:", opts: ["2^n", "n²", "2n", "n!"], ans: "0", topic: "Set Theory", exp: "Power set cardinality is 2^n for a set with n elements." },
    { q: "If P(A) = 0.4, P(B) = 0.5 and P(A ∩ B) = 0.2, then P(A ∪ B) is:", opts: ["0.7", "0.9", "0.3", "0.1"], ans: "0", topic: "Probability", exp: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.4 + 0.5 - 0.2 = 0.7." },
    { q: "Number of ways to arrange 5 distinct objects in a row is:", opts: ["120 (5!)", "25", "60", "24"], ans: "0", topic: "Permutations & Combinations", exp: "5! = 5 × 4 × 3 × 2 × 1 = 120." },
    { q: "Value of combination ⁵C₂ is equal to:", opts: ["10", "20", "5", "60"], ans: "0", topic: "Combinatorics", exp: "⁵C₂ = (5 × 4) / (2 × 1) = 10." },
    { q: "A relation R on set A is equivalence if it is:", opts: ["Reflexive, Symmetric and Transitive", "Reflexive and Symmetric only", "Symmetric and Transitive only", "Reflexive only"], ans: "0", topic: "Relations & Functions", exp: "Definition of equivalence relation requires all three properties." },
    { q: "Probability of getting an even number on rolling a fair 6-sided die is:", opts: ["1/2", "1/3", "1/6", "2/3"], ans: "0", topic: "Probability", exp: "Even numbers are {2, 4, 6} (3 outcomes out of 6) ⇒ 3/6 = 1/2." },
    { q: "Domain of real function f(x) = √(x - 4) is:", opts: ["[4, ∞)", "(4, ∞)", "(-∞, 4]", "[0, ∞)"], ans: "0", topic: "Functions", exp: "Expression under square root must be non-negative: x - 4 ≥ 0 ⇒ x ≥ 4." },
    { q: "In a binomial distribution B(n, p), mean is given by:", opts: ["n p", "n p q", "√(n p q)", "n / p"], ans: "0", topic: "Probability Distributions", exp: "Mean of binomial distribution is n × p." }
  ],

  Physics: [
    // 1-10: Optics
    { q: "According to Snell's Law of refraction, the ratio sin(i) / sin(r) is equal to:", opts: ["Refractive index of medium 2 with respect to medium 1", "Speed of light in vacuum", "Critical angle of medium", "Focal length of lens"], ans: "0", topic: "Optics", exp: "Snell's Law states sin(i)/sin(r) = n2/n1." },
    { q: "The SI unit of power of a optical lens is:", opts: ["Diopter (D)", "Meter (m)", "Watt (W)", "Lumen (lm)"], ans: "0", topic: "Ray Optics", exp: "Power P = 1 / f (in meters), measured in Diopters." },
    { q: "Focal length of a plane mirror is:", opts: ["Infinity (∞)", "Zero", "10 cm", "1 meter"], ans: "0", topic: "Ray Optics", exp: "A plane mirror has flat surface with radius of curvature R = ∞ ⇒ f = ∞." },
    { q: "Phenomenon responsible for brilliant colors in thin soap bubbles is:", opts: ["Thin-film Interference", "Diffraction", "Polarization", "Refraction"], ans: "0", topic: "Wave Optics", exp: "Interference of light waves reflected from front and back surfaces." },
    { q: "Critical angle is angle of incidence in denser medium for which angle of refraction in rarer medium is:", opts: ["90°", "0°", "45°", "180°"], ans: "0", topic: "Ray Optics", exp: "At critical angle θc, refracted ray grazes surface (r = 90°)." },
    { q: "In Young's double slit experiment, fringe width β is given by:", opts: ["λ D / d", "λ d / D", "d D / λ", "λ / (D d)"], ans: "0", topic: "Wave Optics", exp: "Fringe width formula β = λ D / d." },
    { q: "Blue color of the sky is due to:", opts: ["Rayleigh Scattering of light", "Total Internal Reflection", "Dispersion of light", "Diffraction of light"], ans: "0", topic: "Ray Optics", exp: "Rayleigh scattering intensity is inversely proportional to λ⁴ (blue scatters most)." },
    { q: "Magnifying power of a simple microscope is:", opts: ["1 + D / f", "D / f", "1 - D / f", "f / D"], ans: "0", topic: "Optical Instruments", exp: "M = 1 + D/f when image is formed at least distance of distinct vision D." },
    { q: "Velocity of light is maximum in:", opts: ["Vacuum", "Water", "Glass", "Diamond"], ans: "0", topic: "Optics", exp: "Speed of light in vacuum c = 3 × 10⁸ m/s, maximum speed limit in universe." },
    { q: "Myopia (short-sightedness) is corrected using a:", opts: ["Concave Lens", "Convex Lens", "Cylindrical Lens", "Bifocal Lens"], ans: "0", topic: "Human Eye", exp: "Diverging concave lens diverges incoming parallel rays to focus on retina." },

    // 11-20: Electromagnetism & Currents
    { q: "The SI unit of magnetic flux density (B) is:", opts: ["Tesla (T)", "Weber (Wb)", "Henry (H)", "Gauss (G)"], ans: "0", topic: "Electromagnetism", exp: "1 Tesla = 1 Weber per square meter." },
    { q: "Ohm's Law V = IR is valid when temperature remains:", opts: ["Constant", "Increasing", "Decreasing", "Zero"], ans: "0", topic: "Current Electricity", exp: "Resistivity depends on temperature; Ohm's law holds at constant temperature." },
    { q: "Kirchhoff's First Law (Current Law Σ I = 0 at junction) is based on conservation of:", opts: ["Charge", "Energy", "Momentum", "Mass"], ans: "0", topic: "Current Electricity", exp: "Total electric charge entering a junction must equal total charge leaving." },
    { q: "Lorentz force on a moving charged particle q in electric E and magnetic B fields is:", opts: ["F = q (E + v × B)", "F = q E + v · B", "F = q (E · B) v", "F = q v × B"], ans: "0", topic: "Moving Charges", exp: "Vector combination of electric force qE and magnetic force q(v × B)." },
    { q: "Self-inductance of a long solenoid is directly proportional to:", opts: ["Square of total turns (N²)", "Number of turns (N)", "Current (I)", "Magnetic field B"], ans: "0", topic: "Electromagnetic Induction", exp: "L = (μ0 N² A) / l, proportional to N²." },
    { q: "Capacitance of a parallel plate capacitor with plate area A and separation d is:", opts: ["ε0 A / d", "ε0 d / A", "A d / ε0", "ε0 A d"], ans: "0", topic: "Electrostatics", exp: "Standard capacitance formula C = ε0 A / d." },
    { q: "The RMS value of an alternating voltage V = V0 sin(ωt) is:", opts: ["V0 / √2", "V0 / 2", "V0 √2", "2 V0 / π"], ans: "0", topic: "Alternating Current", exp: "V_rms = V0 / √2 ≈ 0.707 V0." },
    { q: "Dimensional formula of electric resistance is:", opts: ["[M¹ L² T⁻³ A⁻²]", "[M¹ L² T⁻² A⁻¹]", "[M¹ L³ T⁻³ A⁻²]", "[M⁰ L² T⁻³ A⁻¹]"], ans: "0", topic: "Electrostatics", exp: "R = V/I = (W/q)/I = [M L² T⁻²] / ([A T] A) = [M L² T⁻³ A⁻²]." },
    { q: "Work done in moving a charge q across potential difference V is:", opts: ["W = q V", "W = q / V", "W = V / q", "W = q V²"], ans: "0", topic: "Electrostatics", exp: "By definition of electric potential V = W / q ⇒ W = q V." },
    { q: "Resistivity of a conductor depends on:", opts: ["Nature of material and temperature", "Length of conductor", "Area of cross section", "Shape of wire"], ans: "0", topic: "Current Electricity", exp: "Resistivity ρ is an intrinsic material property independent of dimensions." },

    // 21-30: Mechanics & Gravitation
    { q: "In simple harmonic motion (SHM), total mechanical energy is proportional to:", opts: ["Square of Amplitude (A²)", "Amplitude (A)", "Frequency (f)", "√A"], ans: "0", topic: "Harmonic Motion", exp: "Total SHM energy E = (1/2) m ω² A²." },
    { q: "Acceleration due to gravity g at center of Earth is:", opts: ["Zero", "9.8 m/s²", "Infinite", "4.9 m/s²"], ans: "0", topic: "Gravitation", exp: "At center of Earth r=0 ⇒ g(r) = g0 (r/R) = 0." },
    { q: "Kinetic energy of a body of mass m moving with velocity v is:", opts: ["(1/2) m v²", "m v²", "m v", "(1/2) m² v"], ans: "0", topic: "Work Energy Power", exp: "K.E. = (1/2) m v²." },
    { q: "Escape velocity from surface of Earth is approximately:", opts: ["11.2 km/s", "9.8 km/s", "7.9 km/s", "3 × 10⁸ m/s"], ans: "0", topic: "Gravitation", exp: "v_escape = √(2 g R) ≈ 11.2 km/s." },
    { q: "Angle of projection for maximum horizontal range of a projectile is:", opts: ["45°", "90°", "30°", "60°"], ans: "0", topic: "Motion in a Plane", exp: "Range R = (v² sin 2θ)/g is maximum when sin 2θ = 1 ⇒ 2θ = 90° ⇒ θ = 45°." },
    { q: "Work done by a force perpendicular to displacement is:", opts: ["Zero", "Maximum", "Negative", "Infinite"], ans: "0", topic: "Work Energy Power", exp: "W = F · d = F d cos(90°) = 0." },
    { q: "Moment of inertia of a thin circular ring of mass M and radius R about central axis is:", opts: ["M R²", "(1/2) M R²", "(2/5) M R²", "(1/12) M R²"], ans: "0", topic: "Rotational Motion", exp: "All mass element elements are at equal distance R from axis ⇒ I = M R²." },
    { q: "Kepler's Third Law states that square of orbital period T is proportional to:", opts: ["Cube of semi-major axis (a³)", "Semi-major axis (a)", "a²", "1 / a³"], ans: "0", topic: "Gravitation", exp: "Kepler's law of periods: T² ∝ a³." },
    { q: "SI unit of impulse is:", opts: ["N s (or kg m/s)", "N / m", "Joule", "Watt"], ans: "0", topic: "Laws of Motion", exp: "Impulse J = Force × time = N s." },
    { q: "Centripetal acceleration of a body moving in circle of radius r with speed v is:", opts: ["v² / r", "v r", "v / r²", "v² r"], ans: "0", topic: "Circular Motion", exp: "a_c = v² / r = ω² r." },

    // 31-40: Oscillations, Waves & Thermodynamics
    { q: "Time period of a simple pendulum of length L is given by:", opts: ["2π √(L / g)", "2π √(g / L)", "π √(L / g)", "(1/2π) √(g / L)"], ans: "0", topic: "Oscillations", exp: "T = 2π √(L / g)." },
    { q: "Speed of sound in vacuum is:", opts: ["0 m/s (Cannot travel)", "340 m/s", "3 × 10⁸ m/s", "1500 m/s"], ans: "0", topic: "Waves", exp: "Sound is a mechanical wave requiring material medium for propagation." },
    { q: "First Law of Thermodynamics ΔQ = ΔU + W is a statement of conservation of:", opts: ["Energy", "Mass", "Momentum", "Temperature"], ans: "0", topic: "Thermodynamics", exp: "Heat supplied equals change in internal energy plus work done." },
    { q: "In an isothermal process, which thermodynamic quantity remains constant?", opts: ["Temperature", "Pressure", "Volume", "Heat content"], ans: "0", topic: "Thermodynamics", exp: "Isothermal process occurs at constant temperature (ΔT = 0 ⇒ ΔU = 0 for ideal gas)." },
    { q: "Efficiency η of a ideal Carnot engine operating between T1 (hot) and T2 (cold) is:", opts: ["1 - T2 / T1", "1 - T1 / T2", "T2 / T1", "T1 / (T1 - T2)"], ans: "0", topic: "Thermodynamics", exp: "η = (T1 - T2) / T1 = 1 - T2 / T1." },
    { q: "In an adiabatic process for ideal gas, relation between P and V is:", opts: ["P V^γ = Constant", "P V = Constant", "P / V = Constant", "V / T = Constant"], ans: "0", topic: "Thermodynamics", exp: "Adiabatic equation P V^γ = C where γ = Cp/Cv." },
    { q: "Distance between two consecutive nodes in a standing wave is:", opts: ["λ / 2", "λ", "λ / 4", "2 λ"], ans: "0", topic: "Waves", exp: "Distance between adjacent nodes or adjacent antinodes is half wavelength (λ/2)." },
    { q: "Beat frequency produced by two sound waves of frequencies f1 and f2 is:", opts: ["|f1 - f2|", "f1 + f2", "(f1 + f2)/2", "f1 × f2"], ans: "0", topic: "Waves", exp: "Beats per second equals absolute frequency difference |f1 - f2|." },
    { q: "Stefan-Boltzmann Law states total emissive power E of blackbody is proportional to:", opts: ["T⁴", "T²", "T", "T³"], ans: "0", topic: "Thermal Radiation", exp: "E = σ T⁴." },
    { q: "Fundamental frequency of a stretched string fixed at both ends of length L is:", opts: ["v / (2 L)", "v / (4 L)", "v / L", "2 v / L"], ans: "0", topic: "Waves", exp: "f1 = v / λ1 = v / (2 L)." },

    // 41-50: Modern Physics & Semiconductors
    { q: "Einstein's photoelectric equation is given by:", opts: ["h ν = Φ + K.E.max", "h ν = Φ / K.E.", "K.E. = h ν Φ", "Φ = h ν K.E."], ans: "0", topic: "Dual Nature of Matter", exp: "Photon energy hν is split into work function Φ and max kinetic energy." },
    { q: "De Broglie wavelength λ associated with momentum p is:", opts: ["h / p", "p / h", "h p", "h / p²"], ans: "0", topic: "Dual Nature of Matter", exp: "De Broglie relation λ = h / p." },
    { q: "Radius of nth Bohr orbit of hydrogen atom is proportional to:", opts: ["n²", "n", "1 / n", "1 / n²"], ans: "0", topic: "Atoms", exp: "r_n = r0 · n²." },
    { q: "In a p-n junction diode under forward bias, depletion layer width:", opts: ["Decreases", "Increases", "Remains constant", "Becomes infinite"], ans: "0", topic: "Semiconductors", exp: "Forward voltage opposes built-in potential, reducing depletion barrier width." },
    { q: "Majority charge carriers in a p-type semiconductor are:", opts: ["Holes", "Electrons", "Protons", "Neutrons"], ans: "0", topic: "Semiconductors", exp: "Doping with trivalent impurity creates excess mobile holes." },
    { q: "Mass-energy equivalence principle formulated by Einstein is:", opts: ["E = m c²", "E = (1/2) m c²", "E = m / c²", "E = m c"], ans: "0", topic: "Nuclei", exp: "E = m c²." },
    { q: "Half-life T1/2 of a radioactive sample with decay constant λ is:", opts: ["0.693 / λ", "λ / 0.693", "1 / λ", "0.693 λ"], ans: "0", topic: "Nuclei", exp: "T1/2 = ln(2) / λ ≈ 0.693 / λ." },
    { q: "SI unit of activity of radioactive source is:", opts: ["Becquerel (Bq)", "Curie (Ci)", "Rutherford", "Gray"], ans: "0", topic: "Nuclei", exp: "1 Becquerel = 1 disintegration per second." },
    { q: "In a NOR gate, output is HIGH (1) only when all inputs are:", opts: ["LOW (0)", "HIGH (1)", "Different", "Zero and One"], ans: "0", topic: "Semiconductors", exp: "NOR gate gives 1 only when OR output is 0, which occurs when all inputs are 0." },
    { q: "Which electromagnetic wave has the shortest wavelength?", opts: ["Gamma Rays", "X-rays", "Ultraviolet", "Radio Waves"], ans: "0", topic: "EM Waves", exp: "Gamma rays have highest frequency (>10¹⁹ Hz) and shortest wavelength (<10⁻¹² m)." },

    // 51-60: Electrostatics, Capacitance & Magnetism
    { q: "Force F between two point charges q1 and q2 separated by distance r in vacuum is:", opts: ["(1 / 4πε0) (q1 q2 / r²)", "(1 / 4πε0) (q1 q2 / r)", "(4πε0) (q1 q2 / r²)", "q1 q2 r²"], ans: "0", topic: "Electrostatics", exp: "Coulomb's Law statement in vector form." },
    { q: "Electric field E inside a uniformly charged conducting spherical shell of radius R is:", opts: ["Zero", "q / 4πε0 R²", "q / 4πε0 r", "Infinite"], ans: "0", topic: "Electrostatics", exp: "All charges reside on outer surface; net enclosed charge inside shell is zero." },
    { q: "SI unit of electric dipole moment (p) is:", opts: ["Coulomb meter (C m)", "Coulomb per meter", "Volt meter", "Farad meter"], ans: "0", topic: "Electrostatics", exp: "Dipole moment p = q × d ⇒ unit C m." },
    { q: "Angle of dip at the Earth's magnetic equator is:", opts: ["0°", "90°", "45°", "60°"], ans: "0", topic: "Magnetism & Matter", exp: "At magnetic equator, magnetic lines of force are parallel to surface (dip angle 0°)." },
    { q: "Susceptibility χ of a diamagnetic material is:", opts: ["Small and negative", "Small and positive", "Very large and positive", "Zero"], ans: "0", topic: "Magnetism & Matter", exp: "Diamagnetic substances are weakly repelled by magnetic fields (χ < 0)." },
    { q: "Energy stored in a capacitor of capacitance C charged to potential V is:", opts: ["(1/2) C V²", "C V²", "(1/2) C² V", "C / V²"], ans: "0", topic: "Electrostatics", exp: "U = (1/2) C V²." },
    { q: "Electric flux through a closed surface enclosing net charge Q in vacuum is:", opts: ["Q / ε0", "Q ε0", "ε0 / Q", "Zero"], ans: "0", topic: "Gauss Law", exp: "Gauss's Law statement: Φ = Q_enclosed / ε0." },
    { q: "Drift velocity v_d of free electrons in a conductor is proportional to applied field E as:", opts: ["v_d ∝ E", "v_d ∝ E²", "v_d ∝ 1/E", "v_d ∝ √E"], ans: "0", topic: "Current Electricity", exp: "v_d = e E τ / m ⇒ v_d is directly proportional to E." },
    { q: "Magnetic force experienced by a current carrying conductor of length L in uniform B field is:", opts: ["I (L × B)", "I (L · B)", "I L B sin²θ", "I B / L"], ans: "0", topic: "Magnetic Effects of Current", exp: "F = I L B sin θ = I (L × B)." },
    { q: "Work done in rotating an electric dipole of moment p by angle θ in field E from 0° is:", opts: ["p E (1 - cos θ)", "p E cos θ", "p E sin θ", "p E (1 + cos θ)"], ans: "0", topic: "Electrostatics", exp: "W = U(θ) - U(0) = -p E cos θ - (-p E) = p E (1 - cos θ)." }
  ],

  Chemistry: [
    // 1-10: Periodic Trends & Bonding
    { q: "Which element has the highest electronegativity on the Pauling scale?", opts: ["Fluorine (F)", "Oxygen (O)", "Chlorine (Cl)", "Nitrogen (N)"], ans: "0", topic: "Periodic Trends", exp: "Fluorine is the most electronegative element with a Pauling electronegativity of 3.98." },
    { q: "Molecular geometry and bond angle of methane (CH4) according to VSEPR theory are:", opts: ["Tetrahedral, 109.5°", "Trigonal Planar, 120°", "Linear, 180°", "Pyramidal, 107°"], ans: "0", topic: "Chemical Bonding", exp: "CH4 has 4 bond pairs and 0 lone pairs around central C (sp3 tetrahedral)." },
    { q: "The hybridization state of carbon atoms in a benzene ring (C6H6) is:", opts: ["sp2", "sp3", "sp", "sp3d"], ans: "0", topic: "Organic Chemistry", exp: "Each carbon in benzene forms 3 sp2 sigma bonds in a planar hexagon." },
    { q: "Which molecule has zero dipole moment due to symmetrical geometry?", opts: ["CCl4", "H2O", "NH3", "CHCl3"], ans: "0", topic: "Chemical Bonding", exp: "Symmetrical tetrahedral CCl4 has individual C-Cl bond dipoles canceling out." },
    { q: "The atomic radius across a period from left to right in the periodic table generally:", opts: ["Decreases", "Increases", "Remains constant", "First increases then decreases"], ans: "0", topic: "Periodic Trends", exp: "Nuclear charge increases while electrons are added to same valence shell." },
    { q: "Form of hydrogen bond present in o-nitrophenol is:", opts: ["Intramolecular Hydrogen Bond", "Intermolecular Hydrogen Bond", "Covalent Bond", "Ionic Bond"], ans: "0", topic: "Chemical Bonding", exp: "Chelate ring formation between -OH and adjacent -NO2 within same molecule." },
    { q: "Which species has the highest first ionization enthalpy?", opts: ["Helium (He)", "Neon (Ne)", "Fluorine (F)", "Argon (Ar)"], ans: "0", topic: "Periodic Trends", exp: "He has 1s² closed shell configuration with smallest atomic radius." },
    { q: "Number of lone pairs of electrons on central xenon atom in XeF2 is:", opts: ["3", "2", "1", "0"], ans: "0", topic: "Chemical Bonding", exp: "Xe has 8 valence e⁻; 2 form single bonds with F, leaving 6 e⁻ = 3 lone pairs." },
    { q: "Bond order of Oxygen molecule (O2) according to Molecular Orbital theory is:", opts: ["2", "1", "3", "1.5"], ans: "0", topic: "Chemical Bonding", exp: "Bond Order = (10 - 6)/2 = 2." },
    { q: "Which element has maximum electron gain enthalpy (most negative ΔegH)?", opts: ["Chlorine (Cl)", "Fluorine (F)", "Bromine (Br)", "Oxygen (O)"], ans: "0", topic: "Periodic Trends", exp: "Chlorine has highest electron affinity due to less inter-electronic repulsion than F." },

    // 11-20: Physical Chemistry & Equilibrium
    { q: "According to Le Chatelier's Principle, increasing pressure shifts equilibrium position toward:", opts: ["Side with fewer moles of gas", "Side with greater moles of gas", "Reactants side always", "Products side always"], ans: "0", topic: "Chemical Equilibrium", exp: "Increasing total pressure favors the direction producing fewer gas moles." },
    { q: "Gas evolved when sodium bicarbonate reacts with dilute hydrochloric acid is:", opts: ["Carbon Dioxide (CO2)", "Hydrogen (H2)", "Oxygen (O2)", "Chlorine (Cl2)"], ans: "0", topic: "Inorganic Chemistry", exp: "NaHCO3 + HCl → NaCl + H2O + CO2(g) ↑." },
    { q: "The pH of a 10⁻³ M aqueous solution of strong acid HCl is:", opts: ["3", "11", "7", "1"], ans: "0", topic: "Ionic Equilibrium", exp: "pH = -log[H+] = -log(10⁻³) = 3." },
    { q: "In a zero-order chemical reaction A → Products, half-life t1/2 is proportional to:", opts: ["Initial concentration [A]0", "1 / [A]0", "Independent of [A]0", "[A]0²"], ans: "0", topic: "Chemical Kinetics", exp: "For zero order: t1/2 = [A]0 / (2 k)." },
    { q: "Arrhenius equation relating rate constant k and temperature T is:", opts: ["k = A e^(-Ea / RT)", "k = A e^(Ea / RT)", "k = A ln(RT)", "k = Ea / (R T)"], ans: "0", topic: "Chemical Kinetics", exp: "k = A e^(-Ea / RT)." },
    { q: "According to Raoult's Law, relative lowering of vapor pressure of dilute solution equals:", opts: ["Mole fraction of solute (x_solute)", "Mole fraction of solvent", "Molality of solution", "Molarity of solution"], ans: "0", topic: "Solutions", exp: "(P° - P)/P° = x_solute." },
    { q: "Faraday's First Law of Electrolysis states mass m deposited at electrode is:", opts: ["m = Z I t", "m = Z / (I t)", "m = I t / Z", "m = Z² I t"], ans: "0", topic: "Electrochemistry", exp: "m = Q × Z = Z × I × t." },
    { q: "Change in Gibbs free energy ΔG for a spontaneous process at constant T and P must be:", opts: ["Negative (ΔG < 0)", "Positive (ΔG > 0)", "Zero (ΔG = 0)", "Infinite"], ans: "0", topic: "Thermodynamics", exp: "Spontaneity criterion: ΔG < 0." },
    { q: "Osmotic pressure π of a dilute solution is given by Van't Hoff equation:", opts: ["π = C R T", "π = C / (R T)", "π = R T / C", "π = C² R T"], ans: "0", topic: "Solutions", exp: "π = C R T where C is molarity." },
    { q: "Unit of rate constant k for a first-order reaction is:", opts: ["s⁻¹ (or time⁻¹)", "mol L⁻¹ s⁻¹", "L mol⁻¹ s⁻¹", "L² mol⁻² s⁻¹"], ans: "0", topic: "Chemical Kinetics", exp: "First order rate = k [A] ⇒ k unit is s⁻¹." },

    // 21-30: Organic Chemistry
    { q: "IUPAC name of ethyl alcohol CH3CH2OH is:", opts: ["Ethanol", "Methanol", "Propanol", "Ethanal"], ans: "0", topic: "Organic Chemistry", exp: "Two-carbon aliphatic alcohol is ethanol." },
    { q: "Addition of HBr to unsymmetrical alkene in presence of peroxide follows:", opts: ["Anti-Markovnikov Rule (Kharasch effect)", "Markovnikov Rule", "Saytzeff Rule", "Huckel Rule"], ans: "0", topic: "Organic Reactions", exp: "Peroxides generate free radicals leading to Anti-Markovnikov addition of HBr." },
    { q: "Reimer-Tiemann reaction converts phenol into:", opts: ["Salicylaldehyde (2-hydroxybenzaldehyde)", "Benzoic Acid", "Salicylic Acid", "Benzaldehyde"], ans: "0", topic: "Organic Reactions", exp: "Phenol treated with CHCl3 and NaOH yields salicylaldehyde." },
    { q: "Grignard reagent is chemically represented as:", opts: ["R-Mg-X", "R-Zn-X", "R-Li", "R-Na"], ans: "0", topic: "Organometallics", exp: "Alkyl magnesium halide R-Mg-X." },
    { q: "Which reagent is used in Lucas Test to distinguish 1°, 2°, and 3° alcohols?", opts: ["Anhydrous ZnCl2 + Conc. HCl", "Acidified K2Cr2O7", "Alkaline KMnO4", "Bromine Water"], ans: "0", topic: "Organic Chemistry", exp: "Lucas reagent is a solution of anhydrous ZnCl2 in concentrated HCl." },
    { q: "Wurtz reaction involves reaction of alkyl halides with which metal in dry ether?", opts: ["Sodium (Na)", "Magnesium (Mg)", "Zinc (Zn)", "Copper (Cu)"], ans: "0", topic: "Organic Reactions", exp: "2 R-X + 2 Na → R-R + 2 NaX." },
    { q: "Functional group present in carboxylic acids is:", opts: ["-COOH", "-CHO", "-CO-", "-OH"], ans: "0", topic: "Organic Chemistry", exp: "Carboxyl group composed of carbonyl and hydroxyl groups." },
    { q: "Aldehydes reduce Fehling's solution to give a brick-red precipitate of:", opts: ["Cuprous Oxide (Cu2O)", "Cupric Oxide (CuO)", "Metallic Copper (Cu)", "Cupric Hydroxide"], ans: "0", topic: "Organic Tests", exp: "Cu²⁺ ions in Fehling's solution are reduced to red Cu2O precipitate." },
    { q: "Ozonolysis of 2-butene followed by Zn/H2O hydrolysis produces:", opts: ["Ethanal (2 moles)", "Methanal", "Propanal", "Acetone"], ans: "0", topic: "Organic Reactions", exp: "CH3-CH=CH-CH3 + O3/Zn → 2 CH3CHO." },
    { q: "Which compound shows positive iodoform test upon treatment with I2 and NaOH?", opts: ["Ethanol (CH3CH2OH)", "Methanol (CH3OH)", "Benzaldehyde", "Formic Acid"], ans: "0", topic: "Organic Tests", exp: "Compounds with CH3CH(OH)- or CH3C=O group give yellow CHI3 precipitate." },

    // 31-40: Inorganic & Coordination Chemistry
    { q: "Oxidation state of Chromium in Potassium Dichromate (K2Cr2O7) is:", opts: ["+6", "+3", "+2", "+7"], ans: "0", topic: "Inorganic Chemistry", exp: "2(+1) + 2(Cr) + 7(-2) = 0 ⇒ 2 Cr = 12 ⇒ Cr = +6." },
    { q: "Coordination number of central metal ion in [Fe(CN)6]⁴⁻ is:", opts: ["6", "4", "2", "8"], ans: "0", topic: "Coordination Compounds", exp: "6 monodentate cyanide ligands (CN⁻) bind to central Fe²⁺ ion." },
    { q: "IUPAC name of coordination complex [Co(NH3)6]Cl3 is:", opts: ["Hexaamminecobalt(III) chloride", "Hexaamminecobalt(II) chloride", "Cobalt hexaammine trichloride", "Trichlorohexamminecobalt"], ans: "0", topic: "Coordination Nomenclature", exp: "Standard IUPAC naming: Hexaammine cobalt in oxidation state +3 with chloride." },
    { q: "Main cause of Lanthanide Contraction across 4f inner transition series is:", opts: ["Poor shielding effect of 4f electrons", "Strong shielding by 5d electrons", "Nuclear charge decrease", "Increase in principal quantum number"], ans: "0", topic: "d & f Block Elements", exp: "Diffuse 4f orbitals poorly shield increasing nuclear charge, drawing shell inward." },
    { q: "Which gas is known as Noble gas due to completely filled valence octet?", opts: ["Argon (Ar)", "Nitrogen (N2)", "Oxygen (O2)", "Chlorine (Cl2)"], ans: "0", topic: "Inorganic Chemistry", exp: "Group 18 elements possess stable closed shell configurations." },
    { q: "Catalyst used in Contact Process for manufacture of Sulfuric Acid (H2SO4) is:", opts: ["Vanadium Pentoxide (V2O5)", "Finely divided Iron (Fe)", "Nickel (Ni)", "Platinum black"], ans: "0", topic: "Industrial Chemistry", exp: "V2O5 catalyzes oxidation of SO2 to SO3 at 450°C." },
    { q: "Catalyst used in Haber-Bosch process for industrial synthesis of Ammonia is:", opts: ["Finely divided Iron (Fe) with Mo promoter", "Nickel (Ni)", "Copper (Cu)", "V2O5"], ans: "0", topic: "Industrial Chemistry", exp: "N2 + 3 H2 ⇌ 2 NH3 catalyzed by iron catalyst." },
    { q: "Color of aqueous Potassium Permanganate (KMnO4) solution is:", opts: ["Purple / Dark Violet", "Orange", "Green", "Yellow"], ans: "0", topic: "Inorganic Chemistry", exp: "Intense purple color arises due to Charge Transfer transition from O²⁻ to Mn⁷⁺." },
    { q: "Composition of Aqua Regia used to dissolve noble metals like Gold and Platinum is:", opts: ["3 parts Conc. HCl : 1 part Conc. HNO3", "1 part Conc. HCl : 3 parts Conc. HNO3", "Equal parts HCl and H2SO4", "Conc. H2SO4 and HNO3"], ans: "0", topic: "Inorganic Chemistry", exp: "Standard ratio 3:1 of conc HCl to conc HNO3." },
    { q: "Hardness of water is primarily caused by dissolved salts of:", opts: ["Calcium (Ca²⁺) and Magnesium (Mg²⁺)", "Sodium (Na⁺) and Potassium (K⁺)", "Iron (Fe³⁺) and Aluminum (Al³⁺)", "Copper (Cu²⁺)"], ans: "0", topic: "Inorganic Chemistry", exp: "Bicarbonates, chlorides and sulfates of Ca²⁺ and Mg²⁺ cause water hardness." },

    // 41-50: Surface Chemistry, Biomolecules & Polymers
    { q: "Physical adsorption (physisorption) is characterized by:", opts: ["Reversible nature and weak van der Waals forces", "Irreversible chemical bond formation", "High activation energy required", "Specific mono-layer formation only"], ans: "0", topic: "Surface Chemistry", exp: "Physisorption involves non-specific weak van der Waals forces and low enthalpy." },
    { q: "Scattering of light by colloidal particles causing visible light path is called:", opts: ["Tyndall Effect", "Brownian Movement", "Electrophoresis", "Peptization"], ans: "0", topic: "Surface Chemistry", exp: "Tyndall effect is optical scattering due to colloidal particle size." },
    { q: "Chemical species responsible for catalytic depletion of stratospheric Ozone layer:", opts: ["Chlorofluorocarbons (CFCs / Cl radicals)", "Carbon Dioxide (CO2)", "Methane (CH4)", "Nitrogen gas (N2)"], ans: "0", topic: "Environmental Chemistry", exp: "UV releases chlorine free radicals from CFCs which catalytically destroy O3." },
    { q: "Monomer unit of Polyvinyl Chloride (PVC) is:", opts: ["Vinyl Chloride (CH2=CHCl)", "Ethene", "Styrene", "Chloroprene"], ans: "0", topic: "Polymers", exp: "Polymerization of vinyl chloride monomer produces PVC." },
    { q: "Monomers of Nylon-6,6 are:", opts: ["Adipic Acid and Hexamethylenediamine", "Caprolactam", "Terephthalic Acid and Ethylene Glycol", "Styrene and 1,3-Butadiene"], ans: "0", topic: "Polymers", exp: "Condensation polymerization of hexamethylenediamine and adipic acid." },
    { q: "Covalent linkage connecting amino acids in proteins is called:", opts: ["Peptide Bond (-CONH-)", "Glycosidic Bond", "Phosphodiester Bond", "Disulfide Bond"], ans: "0", topic: "Biomolecules", exp: "Condensation of -COOH of one amino acid with -NH2 of another forms peptide bond." },
    { q: "Which vitamin deficiency causes Scurvy characterized by bleeding gums?", opts: ["Vitamin C (Ascorbic Acid)", "Vitamin A", "Vitamin D", "Vitamin B12"], ans: "0", topic: "Biomolecules", exp: "Vitamin C is essential for collagen synthesis; deficiency causes scurvy." },
    { q: "Carbohydrate stored in liver and muscles of human body as energy reserve:", opts: ["Glycogen", "Starch", "Cellulose", "Sucrose"], ans: "0", topic: "Biomolecules", exp: "Glycogen is branched polysaccharide animal starch stored in liver." },
    { q: "Purine nitrogenous base present in both DNA and RNA is:", opts: ["Adenine (A)", "Thymine (T)", "Uracil (U)", "Cytosine (C)"], ans: "0", topic: "Biomolecules", exp: "Adenine and Guanine are purines found in both DNA and RNA." },
    { q: "Zeta potential is a measure of which property of colloidal solutions?", opts: ["Stability of colloidal particles", "Viscosity", "Color intensity", "Surface tension"], ans: "0", topic: "Surface Chemistry", exp: "Repulsive electrostatic forces between particles determine colloidal stability." },

    // 51-60: Electrochemistry, Solid State & General Chemistry
    { q: "Standard Reduction Potential of Standard Hydrogen Electrode (SHE) is defined as:", opts: ["0.00 Volts at all temperatures", "1.00 Volt", "1.23 Volts", "-0.76 Volts"], ans: "0", topic: "Electrochemistry", exp: "Arbitrarily assigned 0.00 V as reference baseline." },
    { q: "In a Galvanic cell, oxidation always takes place at:", opts: ["Anode", "Cathode", "Salt Bridge", "Both electrodes"], ans: "0", topic: "Electrochemistry", exp: "Anode is defined as the electrode where oxidation occurs." },
    { q: "Defect in crystalline solids where equal number of cations and anions are missing:", opts: ["Schottky Defect", "Frenkel Defect", "Metal Excess Defect", "Impurity Defect"], ans: "0", topic: "Solid State", exp: "Schottky defect preserves stoichiometry by creating paired ion vacancies." },
    { q: "Number of atoms present per unit cell in a Face-Centered Cubic (FCC) crystal is:", opts: ["4", "2", "1", "8"], ans: "0", topic: "Solid State", exp: "Corners (8 × 1/8 = 1) + Faces (6 × 1/2 = 3) = 4 total atoms." },
    { q: "Molar mass of water (H2O) molecule is:", opts: ["18 g/mol", "16 g/mol", "32 g/mol", "20 g/mol"], ans: "0", topic: "Stoichiometry", exp: "2(1.008) + 16.00 = 18.016 g/mol." },
    { q: "Number of molecules present in 1 mole of any substance (Avogadro Constant) is:", opts: ["6.022 × 10²³", "3.00 × 10⁸", "1.602 × 10⁻¹⁹", "6.626 × 10⁻³⁴"], ans: "0", topic: "Basic Concepts", exp: "N_A = 6.02214 × 10²³ mol⁻¹." },
    { q: "Empirical formula of Glucose (C6H12O6) is:", opts: ["CH2O", "C2H4O2", "CHO", "C6H12O6"], ans: "0", topic: "Basic Concepts", exp: "Simplest whole-number molar ratio C:H:O = 1:2:1 ⇒ CH2O." },
    { q: "Substance acting both as an acid and a base is called:", opts: ["Amphoteric", "Aprotic", "Neutral", "Buffer"], ans: "0", topic: "Acid-Base Chemistry", exp: "Amphoteric species (like H2O, Al2O3) can donate or accept protons." },
    { q: "Which gas law states equal volumes of gases at same T and P contain equal molecules?", opts: ["Avogadro's Law", "Boyle's Law", "Charles' Law", "Dalton's Law"], ans: "0", topic: "States of Matter", exp: "V ∝ n at constant temperature and pressure." },
    { q: "Standard Temperature and Pressure (STP) molar volume of an ideal gas is:", opts: ["22.4 Liters", "24.5 Liters", "11.2 Liters", "1.0 Liter"], ans: "0", topic: "States of Matter", exp: "1 mole of ideal gas occupies 22.4 L at 273.15 K and 1 atm." }
  ],

  Biology: [
    // 1-10: Cell Biology & Molecular Genetics
    { q: "Which cell organelle is known as the powerhouse of the cell due to ATP synthesis?", opts: ["Mitochondria", "Lysosome", "Golgi Apparatus", "Endoplasmic Reticulum"], ans: "0", topic: "Cell Biology", exp: "Mitochondria generate ATP through oxidative phosphorylation." },
    { q: "In DNA double-helix structure, Adenine forms hydrogen bonds specifically with:", opts: ["Thymine", "Cytosine", "Guanine", "Uracil"], ans: "0", topic: "Molecular Genetics", exp: "Adenine pairs with Thymine via 2 hydrogen bonds in DNA." },
    { q: "Which enzyme unwinds the double-stranded DNA molecule during replication?", opts: ["DNA Helicase", "DNA Polymerase III", "DNA Ligase", "RNA Primase"], ans: "0", topic: "Molecular Genetics", exp: "Helicase breaks hydrogen bonds to open the replication fork." },
    { q: "Mendelian monohybrid cross F2 phenotypic ratio is:", opts: ["3 : 1", "1 : 2 : 1", "9 : 3 : 3 : 1", "2 : 1"], ans: "0", topic: "Genetics", exp: "Tall to dwarf ratio in F2 generation of pea plants is 3:1." },
    { q: "Cell organelle primarily involved in cellular protein synthesis is:", opts: ["Ribosome", "Lysosome", "Peroxisome", "Vacuole"], ans: "0", topic: "Cell Biology", exp: "Ribosomes translate mRNA into polypeptide chains." },
    { q: "During which phase of meiotic prophase I does crossing over occur?", opts: ["Pachytene", "Leptotene", "Zygotene", "Diplotene"], ans: "0", topic: "Cell Division", exp: "Recombination nodules form and non-sister chromatids exchange genetic material during Pachytene." },
    { q: "Universal initiation start codon in protein synthesis is:", opts: ["AUG (Methionine)", "UAA", "UAG", "UGA"], ans: "0", topic: "Molecular Genetics", exp: "AUG codes for Methionine and signals start of translation." },
    { q: "Process of copying genetic information from one strand of DNA into RNA is:", opts: ["Transcription", "Translation", "Replication", "Transformation"], ans: "0", topic: "Molecular Genetics", exp: "RNA Polymerase synthesizes RNA from DNA template strand." },
    { q: "Suicide bags of the cell containing hydrolytic digestive enzymes are:", opts: ["Lysosomes", "Centrosomes", "Dictyosomes", "Glyoxysomes"], ans: "0", topic: "Cell Biology", exp: "Lysosomes contain acid hydrolases capable of digesting cellular debris." },
    { q: "Organelle responsible for packaging and secretion of proteins is:", opts: ["Golgi Apparatus", "Rough ER", "Smooth ER", "Nucleolus"], ans: "0", topic: "Cell Biology", exp: "Golgi apparatus modifies, sorts and packages proteins into secretory vesicles." },

    // 11-20: Plant Physiology & Anatomy
    { q: "Which plant hormone is primarily responsible for apical dominance and cell elongation?", opts: ["Auxin (IAA)", "Gibberellin", "Cytokinin", "Abscisic Acid"], ans: "0", topic: "Plant Physiology", exp: "Auxin synthesized at shoot apex inhibits growth of lateral buds." },
    { q: "In green plants, light-dependent reactions of photosynthesis occur in:", opts: ["Thylakoid Membrane", "Stroma", "Outer Membrane", "Cristae"], ans: "0", topic: "Photosynthesis", exp: "Photosystems located in thylakoid membranes convert solar energy into ATP & NADPH." },
    { q: "Vascular tissue responsible for translocation of photosynthates (sucrose) in plants is:", opts: ["Phloem", "Xylem", "Parenchyma", "Collenchyma"], ans: "0", topic: "Plant Anatomy", exp: "Sieve tube elements of phloem conduct organic food from leaves to sinks." },
    { q: "Stomatal opening and closing is driven by turgor changes in:", opts: ["Guard Cells", "Subsidiary Cells", "Epidermal Cells", "Mesophyll Cells"], ans: "0", topic: "Plant Physiology", exp: "K+ accumulation draws water into guard cells, causing stomatal pore to open." },
    { q: "Primary CO2 fixing enzyme in C4 plants (like maize and sugarcane) is:", opts: ["PEP Carboxylase (PEPcase)", "RuBisCO", "Carbonic Anhydrase", "ATP Synthase"], ans: "0", topic: "Photosynthesis", exp: "PEPcase in mesophyll cells fixes CO2 into 4-carbon oxaloacetate." },
    { q: "Most abundant protein / enzyme in the entire biosphere is:", opts: ["RuBisCO", "Collagen", "Hemoglobin", "Keratin"], ans: "0", topic: "Photosynthesis", exp: "RuBisCO catalyzes Calvin cycle carbon fixation in all green plants." },
    { q: "Root nodules of leguminous plants host which symbiotic nitrogen-fixing bacterium?", opts: ["Rhizobium", "Azotobacter", "Nitrosomonas", "Clostridium"], ans: "0", topic: "Mineral Nutrition", exp: "Rhizobium fixes atmospheric N2 into ammonia inside legume root nodules." },
    { q: "Gaseous plant hormone responsible for fruit ripening and abscission is:", opts: ["Ethylene (C2H4)", "Abscisic Acid", "Gibberellic Acid", "Zeatin"], ans: "0", topic: "Plant Hormones", exp: "Ethylene gas accelerates fruit ripening and leaf fall." },
    { q: "Water potential of pure water at standard temperature and atmospheric pressure is:", opts: ["Zero", "1.0", "-1.0", "100"], ans: "0", topic: "Plant Water Relations", exp: "By convention, pure water has maximum water potential defined as zero." },
    { q: "Specialized water-conducting cells in xylem of angiosperms are:", opts: ["Vessels and Tracheids", "Sieve Tubes", "Companion Cells", "Phloem Fibers"], ans: "0", topic: "Plant Anatomy", exp: "Lignified vessels and tracheids form continuous conduits for ascent of sap." },

    // 21-30: Human Physiology
    { q: "Structural and functional unit of the human kidney responsible for filtration is:", opts: ["Nephron", "Neuron", "Alveolus", "Glomerulus"], ans: "0", topic: "Human Physiology", exp: "Each human kidney contains ~1 million nephrons." },
    { q: "Which hormone secreted by pancreas lowers blood glucose concentration?", opts: ["Insulin", "Glucagon", "Somatostatin", "Thyroxine"], ans: "0", topic: "Endocrine System", exp: "Insulin promotes glucose uptake into liver and muscle cells." },
    { q: "Iron-containing respiratory pigment present in human red blood cells is:", opts: ["Hemoglobin", "Myoglobin", "Hemocyanin", "Bilirubin"], ans: "0", topic: "Circulatory System", exp: "Hemoglobin binds up to 4 O2 molecules per tetramer." },
    { q: "Natural pacemaker of the human heart that initiates cardiac impulse is:", opts: ["Sinoatrial Node (SA Node)", "Atrioventricular Node", "Bundle of His", "Purkinje Fibers"], ans: "0", topic: "Human Heart", exp: "SA node in right atrium generates rhythmic action potentials (~72 bpm)." },
    { q: "Basic structural and functional unit of the human nervous system is:", opts: ["Neuron", "Nephron", "Glial Cell", "Synapse"], ans: "0", topic: "Nervous System", exp: "Neurons transmit electrical nerve impulses across the body." },
    { q: "Major proteolytic enzyme in human stomach that functions at low pH (~1.8) is:", opts: ["Pepsin", "Trypsin", "Amylase", "Lipase"], ans: "0", topic: "Digestive System", exp: "Pepsinogen activated by HCl into pepsin breaks proteins into peptones." },
    { q: "Functional respiratory unit in human lungs where gas exchange occurs is:", opts: ["Alveolus", "Bronchiole", "Trachea", "Larynx"], ans: "0", topic: "Respiratory System", exp: "Thin alveolar membrane permits diffusion of O2 and CO2 with capillary blood." },
    { q: "Chemical substance released at chemical synapses to transmit nerve impulse:", opts: ["Neurotransmitter (e.g. Acetylcholine)", "Hormone", "Enzyme", "Antibody"], ans: "0", topic: "Nervous System", exp: "Neurotransmitters diffuse across synaptic cleft to bind post-synaptic receptors." },
    { q: "Structural unit of muscle contraction according to sliding filament theory is:", opts: ["Sarcomere", "Sarcolemma", "Myofibril", "Fascicle"], ans: "0", topic: "Locomotion", exp: "Sarcomere is segment between two adjacent Z-lines." },
    { q: "Hormone responsible for fight-or-flight emergency response secreted by adrenal medulla:", opts: ["Adrenaline (Epinephrine)", "Cortisol", "Aldosterone", "Insulin"], ans: "0", topic: "Endocrine System", exp: "Adrenaline increases heart rate, blood pressure and blood glucose." },

    // 31-40: Biotechnology & Ecology
    { q: "Molecular scissors extensively used in recombinant DNA technology to cut DNA:", opts: ["Restriction Endonucleases", "DNA Ligases", "Reverse Transcriptases", "Taq Polymerases"], ans: "0", topic: "Biotechnology", exp: "Restriction enzymes cut dsDNA at specific palindromic recognition sequences." },
    { q: "Heat-stable DNA polymerase enzyme used in Polymerase Chain Reaction (PCR):", opts: ["Taq Polymerase", "DNA Polymerase I", "RNA Polymerase", "Helicase"], ans: "0", topic: "Biotechnology", exp: "Isolated from thermophilic bacterium Thermus aquaticus." },
    { q: "Most widely used cloning vector plasmid in E. coli genetics is:", opts: ["pBR322", "Ti Plasmid", "BAC", "YAC"], ans: "0", topic: "Biotechnology", exp: "pBR322 carries ampR and tetR selectable marker genes." },
    { q: "In ecological energy pyramid, percentage of energy transferred to next trophic level:", opts: ["10%", "50%", "25%", "90%"], ans: "0", topic: "Ecology", exp: "Lindeman 10% Law: ~90% energy lost as heat at each step." },
    { q: "Organisms occupying first trophic level in all terrestrial ecosystems are:", opts: ["Primary Producers (Green Plants)", "Primary Consumers", "Secondary Consumers", "Decomposers"], ans: "0", topic: "Ecology", exp: "Autotrophs convert solar energy into organic biomass." },
    { q: "Enzyme used to join two DNA fragments during gene cloning is:", opts: ["DNA Ligase", "DNA Polymerase", "Restriction Enzyme", "Exonuclease"], ans: "0", topic: "Biotechnology", exp: "DNA Ligase forms phosphodiester bonds between sticky/blunt ends." },
    { q: "In agarose gel electrophoresis, DNA fragments move toward anode because DNA is:", opts: ["Negatively Charged", "Positively Charged", "Neutral", "Hydrophobic"], ans: "0", topic: "Biotechnology", exp: "Phosphate backbone imparts net negative charge to DNA molecules." },
    { q: "Insecticidal protein gene isolated from Bacillus thuringiensis used in transgenic crops:", opts: ["Cry Gene", "Bt Gene", "Nif Gene", "Vector Gene"], ans: "0", topic: "Biotechnology", exp: "Cry proteins form crystal endotoxins toxic to bollworms." },
    { q: "Increase in concentration of non-biodegradable toxicant (like DDT) at higher trophic levels:", opts: ["Biomagnification", "Eutrophication", "Bioaccumulation", "Biodegradation"], ans: "0", topic: "Environmental Issues", exp: "Toxin cannot be metabolized, concentrating up food chain." },
    { q: "Nutrient enrichment of aquatic bodies causing algal blooms and oxygen depletion is:", opts: ["Eutrophication", "Biomagnification", "Acid Rain", "Global Warming"], ans: "0", topic: "Environmental Issues", exp: "Excess N and P lead to dense algal growth and fish mortality." },

    // 41-50: Reproduction & Evolution
    { q: "Process of double fertilization is a characteristic feature unique to:", opts: ["Angiosperms (Flowering Plants)", "Gymnosperms", "Pteridophytes", "Bryophytes"], ans: "0", topic: "Plant Reproduction", exp: "Involves syngamy (zygote) and triple fusion (PEN / endosperm)." },
    { q: "In human females, fertilization of ovum by sperm normally occurs in:", opts: ["Ampulla of Fallopian Tube", "Uterus", "Ovary", "Vagina"], ans: "0", topic: "Human Reproduction", exp: "Ampullary-isthmic junction is site of fertilization." },
    { q: "Yellow endocrine structure formed in ovary after ovulation that secretes Progesterone:", opts: ["Corpus Luteum", "Graafian Follicle", "Corpus Albicans", "Zona Pellucida"], ans: "0", topic: "Human Reproduction", exp: "Ruptured follicle converts to corpus luteum to maintain uterine endometrium." },
    { q: "Nutritive cells present in seminiferous tubules that nourish developing sperms:", opts: ["Sertoli Cells", "Leydig Cells", "Germ Cells", "Interstitial Cells"], ans: "0", topic: "Human Reproduction", exp: "Sertoli cells provide nutrients to developing spermatids." },
    { q: "Flippers of penguins and dolphins showing similar function with different origin are:", opts: ["Analogous Organs (Convergent Evolution)", "Homologous Organs", "Vestigial Organs", "Atavistic Organs"], ans: "0", topic: "Evolution", exp: "Different anatomical ancestry adapted to aquatic swimming." },
    { q: "Hardy-Weinberg equilibrium equation for allele frequencies in ideal population is:", opts: ["p² + 2pq + q² = 1", "p + q = 2", "p² + q² = 1", "p q = 1"], ans: "0", topic: "Evolutionary Genetics", exp: "Sum of frequencies of all alleles and genotypes equals 1." },
    { q: "Evolutionary pattern seen in Darwin's Finches on Galapagos Islands is:", opts: ["Adaptive Radiation", "Parallel Evolution", "Convergent Evolution", "Co-extinction"], ans: "0", topic: "Evolution", exp: "Single ancestral species radiated into diverse beak forms adapted to food sources." },
    { q: "Enzymatic cap structure on sperm head that helps penetrate egg zona pellucida is:", opts: ["Acrosome", "Centriole", "Axoneme", "Midpiece"], ans: "0", topic: "Human Reproduction", exp: "Acrosome contains hyaluronidase and acrosin enzymes." },
    { q: "Hormone detected in human pregnancy urine test kits is:", opts: ["hCG (Human Chorionic Gonadotropin)", "Estrogen", "Progesterone", "LH"], ans: "0", topic: "Human Reproduction", exp: "Trophoblast secretes hCG to maintain corpus luteum during early pregnancy." },
    { q: "Famous experiment simulating primitive Earth atmosphere (CH4, NH3, H2, H2O spark):", opts: ["Miller-Urey Experiment", "Hershey-Chase Experiment", "Meselson-Stahl Experiment", "Griffith Experiment"], ans: "0", topic: "Origin of Life", exp: "Spark discharge experiment synthesized organic amino acids from inorganic gases." },

    // 51-60: Human Health, Microbes & Ecology
    { q: "Causative pathogen responsible for Typhoid fever in humans is:", opts: ["Salmonella typhi", "Plasmodium vivax", "Entamoeba histolytica", "Mycobacterium tuberculosis"], ans: "0", topic: "Human Health", exp: "Gram-negative bacterium S. typhi transmitted via contaminated food/water." },
    { q: "Immunity acquired by fetus from mother across placenta (IgG antibodies) is:", opts: ["Natural Passive Immunity", "Active Immunity", "Artificial Active Immunity", "Autoimmunity"], ans: "0", topic: "Immunity", exp: "Pre-formed maternal IgG antibodies cross placental barrier." },
    { q: "Malignant tumor of epithelial tissue origin is called a:", opts: ["Carcinoma", "Sarcoma", "Lymphoma", "Leukemia"], ans: "0", topic: "Human Health", exp: "Carcinomas arise from epithelial skin and organ linings." },
    { q: "Microorganism used in bakeries and breweries for ethanol fermentation is:", opts: ["Saccharomyces cerevisiae (Yeast)", "Lactobacillus", "Penicillium", "Aspergillus"], ans: "0", topic: "Microbes in Welfare", exp: "Baker's/Brewer's yeast ferments sugars into CO2 and ethanol." },
    { q: "First discovered antibiotic isolated by Alexander Fleming from fungus is:", opts: ["Penicillin", "Streptomycin", "Tetracycline", "Chloramphenicol"], ans: "0", topic: "Microbes in Welfare", exp: "Fleming isolated penicillin from Penicillium notatum." },
    { q: "Bioluminescent marine dinoflagellate causing red tides in oceans is:", opts: ["Gonyaulax", "Euglena", "Noctiluca", "Paramecium"], ans: "0", topic: "Biological Classification", exp: "Rapid multiplication of red dinoflagellates colors sea water red." },
    { q: "Bacterium responsible for converting milk into curd is:", opts: ["Lactic Acid Bacteria (LAB / Lactobacillus)", "Streptococcus", "Acetobacter", "Rhizobium"], ans: "0", topic: "Microbes in Welfare", exp: "LAB ferments lactose into lactic acid, coagulating milk proteins." },
    { q: "Widal test is clinical diagnostic test used to confirm:", opts: ["Typhoid", "Tuberculosis", "Malaria", "AIDS"], ans: "0", topic: "Human Health", exp: "Serological test detecting Salmonella antibodies." },
    { q: "Vector responsible for transmitting Malaria parasite (Plasmodium) to humans:", opts: ["Female Anopheles Mosquito", "Aedes Mosquito", "Culex Mosquito", "Housefly"], ans: "0", topic: "Human Health", exp: "Female Anopheles transfers sporozoites during blood meal." },
    { q: "Primary organ infected and damaged by Hepatitis viruses is the:", opts: ["Liver", "Lung", "Kidney", "Heart"], ans: "0", topic: "Human Health", exp: "Hepatitis causes inflammatory cell damage in liver tissue." }
  ]
};

/**
 * Returns 60 distinct questions for a given subject (Mathematics, Physics, Chemistry, Biology) and set (A, B, C, D).
 */
export const generate60QuestionsForSet = (subject = 'Mathematics', setLabel = 'A') => {
  const normSubj = (subject || '').toLowerCase();
  let key = 'Mathematics';
  if (normSubj.includes('bio')) key = 'Biology';
  else if (normSubj.includes('phys')) key = 'Physics';
  else if (normSubj.includes('chem')) key = 'Chemistry';

  const baseQuestions = RAW_QUESTIONS[key] || RAW_QUESTIONS.Mathematics;
  
  // Deterministic rotation per set so Set A, B, C, D have unique orderings of the 60 questions
  const setIndex = ['A', 'B', 'C', 'D'].indexOf(setLabel.toUpperCase());
  const shift = setIndex >= 0 ? setIndex * 15 : 0; // Rotate by 0, 15, 30, 45 for sets A, B, C, D

  const setQuestions = [];
  const totalCount = baseQuestions.length; // 60 questions

  for (let i = 0; i < 60; i++) {
    const rawIdx = (i + shift) % totalCount;
    const qRaw = baseQuestions[rawIdx];

    const qNum = i + 1;
    const opts = qRaw.optsArr || qRaw.opts;

    setQuestions.push({
      id: `q-${setLabel}-${qNum}`,
      question_id: `q-${setLabel}-${qNum}`,
      question_text: `Q${qNum}. ${qRaw.q}`,
      question: `Q${qNum}. ${qRaw.q}`,
      options: opts,
      correct_option: qRaw.ans || '0',
      topic: qRaw.topic || 'General KCET',
      explanation: qRaw.exp || ''
    });
  }

  return setQuestions;
};

/**
 * Generates 4 sets (A, B, C, D) with 60 questions each (240 questions total).
 */
export const generate4SetsOf60Questions = (subject = 'Mathematics') => {
  return ['A', 'B', 'C', 'D'].map(lbl => {
    const qs = generate60QuestionsForSet(subject, lbl);
    return {
      set_label: lbl,
      set_id: `SET-${lbl}`,
      question_count: 60,
      questions: qs
    };
  });
};
