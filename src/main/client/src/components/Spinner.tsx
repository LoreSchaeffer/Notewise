import './Spinner.css';

type SpinnerType = {
    type?: 'primary' | 'primary-variant' | 'error' | 'error-variant' | 'warning' | 'warning-variant' | 'success' | 'success-variant' | 'white' | 'black' | 'gray' | 'rgb';
}

export function Spinner({type = 'primary'}: SpinnerType) {

    return (
        <span className={`spinner spinner-${type}`}>
            <svg className="circle" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle className="spinner-path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
        </span>
    )
}