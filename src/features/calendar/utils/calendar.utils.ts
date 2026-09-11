export type CalendarMonthInfo = {
    monthKey: string;

    year: number;
    monthIndex: number;

    monthLabel: string;

    gridStartDate: string;
    gridEndDate: string;

    previousMonth: string;
    nextMonth: string;

    days: string[];
};

function toDateString(
    date: Date
) {
    const year =
        date.getUTCFullYear();

    const month =
        String(
            date.getUTCMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getUTCDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function toMonthKey(
    year: number,
    monthIndex: number
) {
    return `${year}-${String(
        monthIndex + 1
    ).padStart(2, "0")}`;
}

export function getCalendarMonthInfo(
    month?: string
): CalendarMonthInfo {
    const now = new Date();

    let year =
        now.getFullYear();

    let monthIndex =
        now.getMonth();

    if (
        month &&
        /^\d{4}-\d{2}$/.test(
            month
        )
    ) {
        const [
            monthYear,
            monthNumber,
        ] =
            month
                .split("-")
                .map(Number);

        if (
            monthNumber >= 1 &&
            monthNumber <= 12
        ) {
            year =
                monthYear;

            monthIndex =
                monthNumber - 1;
        }
    }

    const firstDay =
        new Date(
            Date.UTC(
                year,
                monthIndex,
                1
            )
        );

    const lastDay =
        new Date(
            Date.UTC(
                year,
                monthIndex + 1,
                0
            )
        );

    // Sunday = 0
    const startOffset =
        firstDay.getUTCDay();

    const gridStart =
        new Date(firstDay);

    gridStart.setUTCDate(
        firstDay.getUTCDate() -
            startOffset
    );

    const endOffset =
        6 -
        lastDay.getUTCDay();

    const gridEnd =
        new Date(lastDay);

    gridEnd.setUTCDate(
        lastDay.getUTCDate() +
            endOffset
    );

    const days: string[] = [];

    const cursor =
        new Date(gridStart);

    while (
        cursor <= gridEnd
    ) {
        days.push(
            toDateString(cursor)
        );

        cursor.setUTCDate(
            cursor.getUTCDate() + 1
        );
    }

    const previous =
        new Date(
            Date.UTC(
                year,
                monthIndex - 1,
                1
            )
        );

    const next =
        new Date(
            Date.UTC(
                year,
                monthIndex + 1,
                1
            )
        );

    return {
        monthKey:
            toMonthKey(
                year,
                monthIndex
            ),

        year,
        monthIndex,

        monthLabel:
            new Intl.DateTimeFormat(
                "en-MY",
                {
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                }
            ).format(
                firstDay
            ),

        gridStartDate:
            toDateString(
                gridStart
            ),

        gridEndDate:
            toDateString(
                gridEnd
            ),

        previousMonth:
            toMonthKey(
                previous.getUTCFullYear(),
                previous.getUTCMonth()
            ),

        nextMonth:
            toMonthKey(
                next.getUTCFullYear(),
                next.getUTCMonth()
            ),

        days,
    };
}