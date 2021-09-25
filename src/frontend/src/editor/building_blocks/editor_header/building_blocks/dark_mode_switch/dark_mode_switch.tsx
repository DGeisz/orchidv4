import React, { useEffect, useState } from "react";
import "./dms_styles.scss";
import { disable, enable } from "darkreader";

/* LocalStorage Dark Mode Key*/
const LS_DM_KEY = "ls-dm-key";

const DarkModeSwitch: React.FC = () => {
    const [is_dark, set_dark] = useState<boolean>(true);

    const set_mode = (is_dark: boolean) => {
        if (is_dark) {
            console.log("Enabling dark");
            enable({
                brightness: 100,
                contrast: 90,
                sepia: 10,
            });
        } else {
            disable();
        }

        window.localStorage.setItem(LS_DM_KEY, JSON.stringify(is_dark));
    };

    useEffect(() => {
        const ls_val = window.localStorage.getItem(LS_DM_KEY);

        if (!!ls_val) {
            const parsed = JSON.parse(ls_val);

            set_mode(parsed);
            set_dark(parsed);
        } else {
            enable({
                brightness: 100,
                contrast: 90,
                sepia: 10,
            });

            set_dark(true);
        }
    }, []);

    return (
        <div
            className="slider-container"
            onClick={() =>
                set_dark((is_dark) => {
                    const new_dark = !is_dark;
                    set_mode(new_dark);

                    return new_dark;
                })
            }
        >
            <div className="slider-abs-container">
                <div className="emoji-container">🌜</div>
                <div className="emoji-container">🌞</div>
            </div>
            <div className={`slider ${!is_dark ? "" : "slider-right"}`} />
        </div>
    );
};

export default DarkModeSwitch;
