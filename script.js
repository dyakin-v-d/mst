// Image fallback handler
const ERROR_IMG_SRC =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

function handleImageError(img) {
	const originalSrc = img.src
	img.onerror = null // Prevent infinite loop
	img.src = ERROR_IMG_SRC
	img.setAttribute('data-original-url', originalSrc)
	img.style.opacity = '0.3'
}

// Modal Management
let modal, modalClose, registrationForm
let loginModal, loginModalClose, loginForm
let recoverModal, recoverModalClose, recoverForm
let countdownTimer = null

function openModal() {
	if (modal) {
		modal.classList.add('active')
		document.body.style.overflow = 'hidden' // Prevent background scrolling
	}
}

function closeModal() {
	if (modal) {
		modal.classList.remove('active')
		document.body.style.overflow = '' // Restore scrolling
		// Reset form
		if (registrationForm) {
			registrationForm.reset()
			// Clear any error messages
			const errorMessages = registrationForm.querySelectorAll('.error-message')
			errorMessages.forEach(msg => msg.remove())
			// Remove error classes
			const inputs = registrationForm.querySelectorAll('input')
			inputs.forEach(input => {
				input.classList.remove('error')
			})
		}
	}
}

function openLoginModal() {
	if (loginModal) {
		loginModal.classList.add('active')
		document.body.style.overflow = 'hidden' // Prevent background scrolling
	}
}

function closeLoginModal() {
	if (loginModal) {
		loginModal.classList.remove('active')
		document.body.style.overflow = '' // Restore scrolling
		// Reset form
		if (loginForm) {
			loginForm.reset()
			// Clear any error messages
			const errorMessages = loginForm.querySelectorAll('.error-message')
			errorMessages.forEach(msg => msg.remove())
			// Remove error classes
			const inputs = loginForm.querySelectorAll('input')
			inputs.forEach(input => {
				input.classList.remove('error')
			})
		}
	}
}

function openRecoverModal() {
	if (recoverModal) {
		recoverModal.classList.add('active')
		document.body.style.overflow = 'hidden' // Prevent background scrolling
	}
}

function closeRecoverModal() {
	if (recoverModal) {
		recoverModal.classList.remove('active')
		document.body.style.overflow = '' // Restore scrolling
		// Reset form
		if (recoverForm) {
			recoverForm.reset()
			// Clear any error messages
			const errorMessages = recoverForm.querySelectorAll('.error-message')
			errorMessages.forEach(msg => msg.remove())
			// Remove error classes
			const inputs = recoverForm.querySelectorAll('input')
			inputs.forEach(input => {
				input.classList.remove('error')
			})
		}
		// Reset timer if active
		if (countdownTimer) {
			clearInterval(countdownTimer)
			countdownTimer = null
		}
		// Reset button
		const sendCodeBtn = document.getElementById('sendCodeBtn')
		if (sendCodeBtn) {
			sendCodeBtn.disabled = false
			sendCodeBtn.textContent = 'Отправить код'
		}
	}
}

// Phone number formatting
function formatPhoneNumber(value) {
	// Remove all non-digit characters
	const phoneNumber = value.replace(/\D/g, '')

	// Format as +7 (XXX) XXX-XX-XX
	if (phoneNumber.length === 0) return ''
	if (phoneNumber.length <= 1) return `+7 (${phoneNumber}`
	if (phoneNumber.length <= 4) return `+7 (${phoneNumber.slice(1)}`
	if (phoneNumber.length <= 7)
		return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4)}`
	if (phoneNumber.length <= 9)
		return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(
			4,
			7
		)}-${phoneNumber.slice(7)}`
	return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(
		4,
		7
	)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9, 11)}`
}

// Show error message
function showError(input, message) {
	// Remove existing error
	const existingError = input.parentElement.querySelector('.error-message')
	if (existingError) {
		existingError.remove()
	}

	// Add error class
	input.classList.add('error')

	// Create error message
	const errorDiv = document.createElement('div')
	errorDiv.className = 'error-message'
	errorDiv.textContent = message
	errorDiv.style.color = '#ef4444'
	errorDiv.style.fontSize = '0.75rem'
	errorDiv.style.marginTop = '4px'
	input.parentElement.appendChild(errorDiv)
}

// Remove error
function removeError(input) {
	input.classList.remove('error')
	const errorMessage = input.parentElement.querySelector('.error-message')
	if (errorMessage) {
		errorMessage.remove()
	}
}

// Validate form
function validateForm(formData) {
	let isValid = true
	const password = formData.get('password')
	const confirmPassword = formData.get('confirmPassword')

	// Validate password match
	if (password !== confirmPassword) {
		const confirmPasswordInput = document.getElementById('confirmPassword')
		showError(confirmPasswordInput, 'Пароли не совпадают')
		isValid = false
	} else {
		const confirmPasswordInput = document.getElementById('confirmPassword')
		removeError(confirmPasswordInput)
	}

	// Validate password length
	if (password && password.length < 8) {
		const passwordInput = document.getElementById('password')
		showError(passwordInput, 'Пароль должен содержать минимум 8 символов')
		isValid = false
	}

	return isValid
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function () {
	// Initialize modal elements
	modal = document.getElementById('registerModal')
	modalClose = modal ? modal.querySelector('.modal-close') : null
	registrationForm = document.getElementById('registrationForm')

	// Initialize login modal elements
	loginModal = document.getElementById('loginModal')
	loginModalClose = loginModal ? loginModal.querySelector('.modal-close') : null
	loginForm = document.getElementById('loginForm')

	// Initialize recover modal elements
	recoverModal = document.getElementById('recoverModal')
	recoverModalClose = recoverModal
		? recoverModal.querySelector('.modal-close')
		: null
	recoverForm = document.getElementById('recoverForm')

	// Handle hero background image
	const heroBgImage = document.querySelector('.hero-bg-image')
	if (heroBgImage) {
		heroBgImage.addEventListener('error', function () {
			handleImageError(this)
		})
	}

	// Handle app screen images
	const appScreenImages = document.querySelectorAll('.app-screen-image')
	appScreenImages.forEach(img => {
		img.addEventListener('error', function () {
			handleImageError(this)
		})
	})

	// Smooth scroll for anchor links
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault()
			const target = document.querySelector(this.getAttribute('href'))
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})
			}
		})
	})

	// Modal open buttons - Register
	document.querySelectorAll('[data-modal="register"]').forEach(button => {
		button.addEventListener('click', function (e) {
			e.preventDefault()
			// Close login modal if open
			if (loginModal && loginModal.classList.contains('active')) {
				closeLoginModal()
				setTimeout(() => openModal(), 300)
			} else {
				openModal()
			}
		})
	})

	// Modal open buttons - Login
	document.querySelectorAll('[data-modal="login"]').forEach(button => {
		button.addEventListener('click', function (e) {
			e.preventDefault()
			const isSwitch = this.hasAttribute('data-switch-modal')

			// If recover modal is open, close it first, then open login
			if (
				isSwitch &&
				recoverModal &&
				recoverModal.classList.contains('active')
			) {
				closeRecoverModal()
				setTimeout(() => openLoginModal(), 300)
			}
			// If register modal is open, close it first, then open login
			else if (modal && modal.classList.contains('active')) {
				closeModal()
				setTimeout(() => openLoginModal(), 300)
			} else {
				openLoginModal()
			}
		})
	})

	// Register modal close button
	if (modalClose) {
		modalClose.addEventListener('click', closeModal)
	}

	// Login modal close button
	if (loginModalClose) {
		loginModalClose.addEventListener('click', closeLoginModal)
	}

	// Close modal on overlay click - Register
	if (modal) {
		modal.addEventListener('click', function (e) {
			if (e.target === modal) {
				closeModal()
			}
		})
	}

	// Close modal on overlay click - Login
	if (loginModal) {
		loginModal.addEventListener('click', function (e) {
			if (e.target === loginModal) {
				closeLoginModal()
			}
		})
	}

	// Modal open buttons - Recover
	document.querySelectorAll('[data-modal="recover"]').forEach(button => {
		button.addEventListener('click', function (e) {
			e.preventDefault()
			// If login modal is open, close it first, then open recover
			if (loginModal && loginModal.classList.contains('active')) {
				closeLoginModal()
				setTimeout(() => openRecoverModal(), 300)
			} else {
				openRecoverModal()
			}
		})
	})

	// Recover modal close button
	if (recoverModalClose) {
		recoverModalClose.addEventListener('click', closeRecoverModal)
	}

	// Close modal on overlay click - Recover
	if (recoverModal) {
		recoverModal.addEventListener('click', function (e) {
			if (e.target === recoverModal) {
				closeRecoverModal()
			}
		})
	}

	// Close modal on Escape key
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			if (modal && modal.classList.contains('active')) {
				closeModal()
			}
			if (loginModal && loginModal.classList.contains('active')) {
				closeLoginModal()
			}
			if (recoverModal && recoverModal.classList.contains('active')) {
				closeRecoverModal()
			}
		}
	})

	// Phone number formatting - Register form
	const phoneInput = document.getElementById('phone')
	if (phoneInput) {
		phoneInput.addEventListener('input', function (e) {
			const formatted = formatPhoneNumber(e.target.value)
			e.target.value = formatted
		})
	}

	// Phone number formatting - Login form (if user types phone)
	const loginEmailInput = document.getElementById('loginEmail')
	if (loginEmailInput) {
		loginEmailInput.addEventListener('input', function (e) {
			const value = e.target.value
			// If starts with +7 or 7 or 8, format as phone
			if (/^[\+]?[78]/.test(value.replace(/\s/g, ''))) {
				const formatted = formatPhoneNumber(value)
				e.target.value = formatted
			}
		})
	}

	// Phone number formatting - Recover form
	const recoverPhoneInput = document.getElementById('recoverPhone')
	if (recoverPhoneInput) {
		recoverPhoneInput.addEventListener('input', function (e) {
			const formatted = formatPhoneNumber(e.target.value)
			e.target.value = formatted
		})
	}

	// Form validation on input
	if (registrationForm) {
		const passwordInput = document.getElementById('password')
		const confirmPasswordInput = document.getElementById('confirmPassword')

		if (confirmPasswordInput) {
			confirmPasswordInput.addEventListener('input', function () {
				if (passwordInput && passwordInput.value !== this.value) {
					showError(this, 'Пароли не совпадают')
				} else {
					removeError(this)
				}
			})
		}

		if (passwordInput) {
			passwordInput.addEventListener('input', function () {
				if (this.value.length > 0 && this.value.length < 8) {
					showError(this, 'Пароль должен содержать минимум 8 символов')
				} else {
					removeError(this)
				}
			})
		}

		// Remove error on input
		registrationForm.querySelectorAll('input').forEach(input => {
			input.addEventListener('input', function () {
				if (this.type !== 'checkbox') {
					removeError(this)
				}
			})
		})
	}

	// Form submission
	if (registrationForm) {
		registrationForm.addEventListener('submit', function (e) {
			e.preventDefault()

			const formData = new FormData(this)

			// Validate form
			if (!validateForm(formData)) {
				return
			}

			// Check checkboxes
			const terms = document.getElementById('terms')
			const age = document.getElementById('age')

			if (!terms || !terms.checked) {
				showError(terms, 'Необходимо согласиться с условиями')
				return
			}

			if (!age || !age.checked) {
				showError(age, 'Необходимо подтвердить возраст')
				return
			}

			// Here you would normally send the data to a server
			console.log('Form submitted:', {
				email: formData.get('email'),
				phone: formData.get('phone'),
				password: '***',
			})

			// Close modal
			closeModal()

			// Redirect to thank you page
			window.location.href = 'thank-you.html'
		})
	}

	// Login form submission
	if (loginForm) {
		loginForm.addEventListener('submit', function (e) {
			e.preventDefault()

			const formData = new FormData(this)
			const loginEmail = formData.get('loginEmail')
			const loginPassword = formData.get('loginPassword')

			// Basic validation
			if (!loginEmail || !loginPassword) {
				alert('Пожалуйста, заполните все поля')
				return
			}

			// Here you would normally send the data to a server
			console.log('Login submitted:', {
				login: loginEmail,
				password: '***',
			})

			// Show success message (you can customize this)
			alert('Вход выполнен успешно!')

			// Close modal
			closeLoginModal()

			// Here you could redirect to dashboard or main page
			// window.location.href = 'dashboard.html';
		})
	}

	// Recover password form submission with timer
	if (recoverForm) {
		recoverForm.addEventListener('submit', function (e) {
			e.preventDefault()

			const formData = new FormData(this)
			const recoverPhone = formData.get('recoverPhone')

			// Basic validation
			if (!recoverPhone) {
				alert('Пожалуйста, введите номер телефона')
				return
			}

			const sendCodeBtn = document.getElementById('sendCodeBtn')
			if (!sendCodeBtn) return

			// Disable button
			sendCodeBtn.disabled = true

			// Here you would normally send the code to a server
			console.log('Recover password requested for:', recoverPhone)

			// Start countdown timer (60 seconds)
			let timeLeft = 60
			sendCodeBtn.textContent = `Отправить код (${timeLeft}с)`

			countdownTimer = setInterval(function () {
				timeLeft--
				if (timeLeft > 0) {
					sendCodeBtn.textContent = `Отправить код (${timeLeft}с)`
				} else {
					// Timer finished
					clearInterval(countdownTimer)
					countdownTimer = null
					sendCodeBtn.disabled = false
					sendCodeBtn.textContent = 'Отправить код'
				}
			}, 1000)

			// Show success message
			alert('Код отправлен на номер ' + recoverPhone)
		})
	}
})
