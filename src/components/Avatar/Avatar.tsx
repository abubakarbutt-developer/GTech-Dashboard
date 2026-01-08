import { Camera } from 'lucide-react';
import { useRef } from 'react';
import './Avatar.css';

interface AvatarProps {
    email: string;
    src?: string;
    size?: 'small' | 'medium' | 'large';
    editable?: boolean;
    onImageChange?: (newImage: string) => void;
}

const Avatar: React.FC<AvatarProps> = ({
    email,
    src,
    size = 'medium',
    editable = false,
    onImageChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = () => {
        if (editable && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onImageChange) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Get initials from email
    const getInitials = (email: string): string => {
        const name = email.split('@')[0];
        const parts = name.split(/[._-]/);

        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    // Generate a consistent color based on email
    const getGradient = (email: string): string => {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        ];

        const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return gradients[hash % gradients.length];
    };

    const initials = getInitials(email);
    const gradient = getGradient(email);

    return (
        <div
            className={`avatar avatar-${size} ${editable ? 'avatar-editable' : ''}`}
            onClick={handleEditClick}
        >
            <div className="avatar-inner" style={{ background: src ? 'transparent' : gradient }}>
                {src ? (
                    <img src={src} alt={email} className="avatar-img" />
                ) : (
                    <span className="avatar-initials">{initials}</span>
                )}

                {editable && (
                    <div className="avatar-edit-overlay">
                        <Camera size={size === 'large' ? 24 : 16} />
                    </div>
                )}
            </div>

            {editable && (
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
            )}
            <div className="avatar-ring"></div>
        </div>
    );
};

export default Avatar;
